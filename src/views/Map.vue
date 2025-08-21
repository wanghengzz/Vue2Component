<!--
 * @Author: wangheng 306604343@qq.com
 * @Date: 2025-08-20 16:53:17
 * @LastEditors: wangheng 306604343@qq.com
 * @LastEditTime: 2025-08-20 22:59:39
 * @FilePath: /Vue2Component/src/views/Map.vue
 * @Description:
-->
<template>
  <div class="map-container">
    <!-- 搜索框 -->
    <div class="search-container">
      <el-input
        v-model="searchKeyword"
        placeholder="请输入城市名称，如：四川成都"
        prefix-icon="el-icon-search"
        class="search-input"
        @keyup.enter.native="handleSearch"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
    </div>

    <!-- 地图容器 -->
    <div id="map" class="map"></div>

    <!-- 信息展示面板 -->
    <div v-if="selectedCity || clickedLocation" class="info-panel">
      <div class="info-header">
        <h3>{{ (selectedCity && selectedCity.name) || (clickedLocation && clickedLocation.name) }}</h3>
        <el-button type="text" icon="el-icon-close" @click="closeInfoPanel"></el-button>
      </div>
      <div class="info-content">
        <!-- 搜索城市信息 -->
        <template v-if="selectedCity">
          <p><strong>省份：</strong>{{ selectedCity.province }}</p>
          <p><strong>经纬度：</strong>{{ selectedCity.coordinates }}</p>
          <p><strong>描述：</strong>{{ selectedCity.description }}</p>
        </template>

        <!-- 点击位置信息 -->
        <template v-if="clickedLocation">
          <p><strong>省份：</strong>{{ clickedLocation.province }}</p>
          <p v-if="clickedLocation.city"><strong>城市：</strong>{{ clickedLocation.city }}</p>
          <p v-if="clickedLocation.district"><strong>区域：</strong>{{ clickedLocation.district }}</p>
          <p><strong>经纬度：</strong>{{ clickedLocation.coordinates }}</p>
          <p v-if="clickedLocation.address"><strong>详细地址：</strong>{{ clickedLocation.address }}</p>
          <p><strong>描述：</strong>{{ clickedLocation.description }}</p>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import 'ol/ol.css'
// 导入 OpenLayers 核心组件
import Map from 'ol/Map'
import View from 'ol/View'
// 导入所有控件
import { defaults as defaultControls } from 'ol/control'
import Attribution from 'ol/control/Attribution'
import Zoom from 'ol/control/Zoom'
import Rotate from 'ol/control/Rotate'
import ZoomSlider from 'ol/control/ZoomSlider'
import ZoomToExtent from 'ol/control/ZoomToExtent'
import ScaleLine from 'ol/control/ScaleLine'
import FullScreen from 'ol/control/FullScreen'
import MousePosition from 'ol/control/MousePosition'
import OverviewMap from 'ol/control/OverviewMap'
import ZoomExtent from 'ol/control/ZoomToExtent'
import Control from 'ol/control/Control'
// 导入图层和数据源
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource, XYZ } from 'ol/source'
import { fromLonLat, toLonLat } from 'ol/proj'
import { createStringXY } from 'ol/coordinate'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Stroke, Fill, Circle } from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'

export default {
  name: 'Map',

  data() {
    return {
      // 地图实例
      map: null,
      // 中国边界图层
      chinaLayer: null,
      // 搜索关键词
      searchKeyword: '',
      // 搜索选中的城市信息
      selectedCity: null,
      // 点击获取的位置信息
      clickedLocation: null,
      // 标记图层（用于显示城市或点击位置）
      markerLayer: null,
      // 防抖定时器
      debounceTimer: null,
      // 动画状态标记
      isAnimating: false,
      // 瓦片缓存标记
      tilesLoaded: false,
      // 控件显示状态
      controlsVisible: {
        scaleLine: true,
        mousePosition: true,
        overviewMap: true,  // 暂时禁用小地图
        zoomSlider: true,
        attribution: true
      },
      // 图层显示状态
      layersVisible: {
        chinaLayer: true,
        markerLayer: true
      },
      // 内置城市数据库，包含主要城市的坐标信息
      cityDatabase: [
        { name: '成都', province: '四川', coordinates: [104.0648, 30.5728], description: '四川省省会，天府之国的核心城市' },
        { name: '北京', province: '北京', coordinates: [116.4074, 39.9042], description: '中华人民共和国首都' },
        { name: '上海', province: '上海', coordinates: [121.4737, 31.2304], description: '中国经济金融中心' },
        { name: '广州', province: '广东', coordinates: [113.2644, 23.1291], description: '广东省省会，南方重要城市' },
        { name: '深圳', province: '广东', coordinates: [114.0579, 22.5431], description: '中国改革开放前沿城市' },
        { name: '杭州', province: '浙江', coordinates: [120.1551, 30.2741], description: '浙江省省会，电商之都' },
        { name: '南京', province: '江苏', coordinates: [118.7969, 32.0603], description: '江苏省省会，六朝古都' },
        { name: '武汉', province: '湖北', coordinates: [114.3054, 30.5931], description: '湖北省省会，九省通衢' },
        { name: '西安', province: '陕西', coordinates: [108.9398, 34.3416], description: '陕西省省会，古都西安' },
        { name: '重庆', province: '重庆', coordinates: [106.5516, 29.5630], description: '直辖市，山城重庆' }
      ]
    }
  },

  // 组件挂载后初始化地图
  mounted() {
    this.initMap()
  },

  // 组件销毁前清理地图资源
  beforeDestroy() {
    // 清理防抖定时器
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    // 清理地图实例
    if (this.map) {
      this.map.setTarget(null)
    }
  },

  methods: {
    // 初始化地图的核心方法
    initMap() {
      // 创建矢量数据源用于存储中国边界数据
      const vectorSource = new VectorSource()

      // 创建中国边界图层，设置红色边框和半透明填充
      this.chinaLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            color: '#ff0000',    // 红色边框
            width: 1
          }),
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.1)'  // 半透明红色填充
          })
        })
      })

      // 创建标记图层，用于显示城市位置或点击位置
      this.markerLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color: '#ff4444' }),      // 红色填充
            stroke: new Stroke({ color: '#ffffff', width: 2 })  // 白色边框
          })
        })
      })

      // 创建优化的底图图层
      const tileLayer = this.createOptimizedTileLayer()

      // 创建所有地图控件
      const controls = this.createMapControls()

      // 创建地图实例，包含底图、中国边界层和标记层
      this.map = new Map({
        target: 'map',  // 绑定到HTML中id为map的元素
        layers: [
          tileLayer,           // 优化的底图图层
          this.chinaLayer,     // 中国边界图层
          this.markerLayer     // 标记图层
        ],
        controls: controls,    // 添加所有控件
        view: new View({
          center: fromLonLat([104.0668, 35.0]), // 地图中心点（中国中心坐标）
          zoom: 4,        // 初始缩放级别
          minZoom: 3,     // 最小缩放级别
          maxZoom: 20,    // 最大缩放级别
          // 性能优化配置
          enableRotation: false,  // 禁用旋转以提升性能
          constrainResolution: true,  // 限制分辨率以提升渲染性能
          smoothResolutionConstraint: false  // 禁用平滑分辨率约束
        })
      })

      // 添加瓦片加载事件监听
      this.addTileLoadListeners(tileLayer)

      // 加载中国边界数据
      this.loadChinaData()

      // 添加地图点击事件监听器
      this.addMapClickListener()
    },

    // 创建优化的瓦片图层
    createOptimizedTileLayer() {
      // 使用高德地图作为主要底图（在中国区域加载更快）
      const gaodeLayer = new TileLayer({
        source: new XYZ({
          url: 'https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
          maxZoom: 18,
          attributions: '© 高德地图',
          // 瓦片缓存优化
          cacheSize: 2048,  // 增加缓存大小
          transition: 150,  // 减少过渡动画时间
          // 预加载策略
          preload: 2,      // 预加载2级
          reprojectionErrorThreshold: 0.5,
          // 解决跨域问题 - 允许导出图片
          crossOrigin: 'anonymous'
        }),
        // 图层优化选项
        preload: 2,        // 预加载周围瓦片
        useInterimTilesOnError: false  // 出错时不使用临时瓦片
      })

      return gaodeLayer
    },

    // 创建所有地图控件
    createMapControls() {
      const controls = []

      // 1. 缩放控件 - 放大缩小按钮
      const zoomControl = new Zoom({
        className: 'ol-zoom custom-zoom',
        zoomInTipLabel: '放大地图 (Zoom In)',
        zoomOutTipLabel: '缩小地图 (Zoom Out)',
        zoomInLabel: '+',
        zoomOutLabel: '−'
      })
      controls.push(zoomControl)

      // 2. 缩放滑块控件 - 垂直滑动条
      if (this.controlsVisible.zoomSlider) {
        const zoomSlider = new ZoomSlider({
          className: 'custom-zoom-slider',
        })
        controls.push(zoomSlider)
      }

      // 3. 比例尺控件 - 显示地图比例尺
      if (this.controlsVisible.scaleLine) {
        const scaleLine = new ScaleLine({
          className: 'custom-scale-line',
          units: 'metric',  // 使用公制单位
          bar: true,        // 显示比例尺条
          steps: 4,         // 比例尺分段数
          text: true,       // 显示文字
          minWidth: 64      // 最小宽度
        })
        controls.push(scaleLine)
      }

      // 4. 鼠标位置控件 - 显示鼠标所在位置的坐标
      if (this.controlsVisible.mousePosition) {
        const mousePosition = new MousePosition({
          className: 'custom-mouse-position',
          coordinateFormat: createStringXY(6), // 保留6位小数
          projection: 'EPSG:4326',              // 显示经纬度坐标
          undefinedHTML: '&nbsp;'               // 鼠标不在地图上时显示的内容
        })
        controls.push(mousePosition)
      }

      // 5. 全屏控件 - 全屏显示地图
      const fullScreen = new FullScreen({
        className: 'custom-fullscreen',
        tipLabel: '全屏显示地图 (Full Screen)',
        label: '⛶',
        labelActive: '↙'
      })
      controls.push(fullScreen)

      // 6. 缩放到范围控件 - 缩放到中国全图
      const zoomToExtent = new ZoomToExtent({
        className: 'custom-zoom-extent',
        tipLabel: '缩放到中国全图 (Zoom to China)',
        label: '🏠',
        extent: fromLonLat([70, 15]).concat(fromLonLat([140, 55]))  // 转换为Web墨卡托坐标
      })
      controls.push(zoomToExtent)

      // 7. 版权信息控件 - 显示数据来源
      if (this.controlsVisible.attribution) {
        const attribution = new Attribution({
          className: 'custom-attribution',
          collapsible: true,    // 可折叠
          collapsed: false,     // 默认展开
          tipLabel: '数据来源信息 (Attribution)'
        })
        controls.push(attribution)
      }

      // 8. 自定义小地图控件 - 替代OverviewMap
      if (this.controlsVisible.overviewMap) {
        const miniMapControl = this.createMiniMapControl()
        controls.push(miniMapControl)
      }

      // 9. 自定义图层切换控件
      const layerSwitcher = this.createLayerSwitcherControl()
      controls.push(layerSwitcher)

      // 10. 自定义工具控件
      const toolControl = this.createToolControl()
      controls.push(toolControl)

      return controls
    },

    // 创建图层切换控件
    createLayerSwitcherControl() {
      const element = document.createElement('div')
      element.className = 'custom-layer-switcher ol-unselectable ol-control'

      // 创建控件HTML结构
      const controlPanel = document.createElement('div')
      controlPanel.className = 'control-panel'

      const title = document.createElement('div')
      title.className = 'control-title'
      title.textContent = '图层控制 (Layers)'

      const content = document.createElement('div')
      content.className = 'control-content'

      // 创建中国边界复选框
      const chinaLabel = document.createElement('label')
      chinaLabel.title = '显示/隐藏中国边界'
      const chinaCheckbox = document.createElement('input')
      chinaCheckbox.type = 'checkbox'
      chinaCheckbox.id = 'china-layer'
      chinaCheckbox.checked = this.layersVisible.chinaLayer
      chinaLabel.appendChild(chinaCheckbox)
      chinaLabel.appendChild(document.createTextNode(' 中国边界'))

      // 创建标记点复选框
      const markerLabel = document.createElement('label')
      markerLabel.title = '显示/隐藏标记点'
      const markerCheckbox = document.createElement('input')
      markerCheckbox.type = 'checkbox'
      markerCheckbox.id = 'marker-layer'
      markerCheckbox.checked = this.layersVisible.markerLayer
      markerLabel.appendChild(markerCheckbox)
      markerLabel.appendChild(document.createTextNode(' 标记点'))

      content.appendChild(chinaLabel)
      content.appendChild(markerLabel)
      controlPanel.appendChild(title)
      controlPanel.appendChild(content)
      element.appendChild(controlPanel)

      // 添加事件监听
      element.addEventListener('change', (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (e.target.type === 'checkbox') {
          if (e.target.id === 'china-layer') {
            this.layersVisible.chinaLayer = e.target.checked
            this.chinaLayer.setVisible(e.target.checked)
            console.log('中国边界显示状态:', e.target.checked)
            this.$message && this.$message.info(`中国边界 ${e.target.checked ? '已显示' : '已隐藏'}`)
          } else if (e.target.id === 'marker-layer') {
            this.layersVisible.markerLayer = e.target.checked
            this.markerLayer.setVisible(e.target.checked)
            console.log('标记点显示状态:', e.target.checked)
            this.$message && this.$message.info(`标记点 ${e.target.checked ? '已显示' : '已隐藏'}`)
          }
        }
      })

      return new Control({ element })
    },

    // 创建自定义小地图控件
    createMiniMapControl() {
      const element = document.createElement('div')
      element.className = 'custom-mini-map ol-unselectable ol-control'

      // 初始状态 - 折叠
      let isExpanded = false

      // 创建按钮
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'mini-map-toggle'
      button.innerHTML = '🗺️'
      button.title = '展开地图概览'

      // 创建小地图容器
      const mapContainer = document.createElement('div')
      mapContainer.className = 'mini-map-container'
      mapContainer.style.display = 'none'

      element.appendChild(button)
      element.appendChild(mapContainer)

      // 小地图实例
      let miniMap = null

      // 切换显示/隐藏
      const toggleMiniMap = () => {
        if (!isExpanded) {
          // 展开小地图
          mapContainer.style.display = 'block'
          button.innerHTML = '×'
          button.title = '收起地图概览'
          isExpanded = true

          // 创建小地图
          if (!miniMap) {
            miniMap = new Map({
              target: mapContainer,
              layers: [
                new TileLayer({
                  source: new OSM({
                    crossOrigin: 'anonymous'
                  })
                })
              ],
              view: new View({
                center: this.map.getView().getCenter(),
                zoom: Math.max(this.map.getView().getZoom() - 4, 1),
                projection: 'EPSG:3857'
              }),
              controls: [],  // 不显示任何控件
              interactions: []  // 不允许交互
            })

            // 同步主地图和小地图的视图
            this.map.getView().on('change:center', () => {
              if (miniMap) {
                miniMap.getView().setCenter(this.map.getView().getCenter())
              }
            })

            this.map.getView().on('change:resolution', () => {
              if (miniMap) {
                miniMap.getView().setZoom(Math.max(this.map.getView().getZoom() - 4, 1))
              }
            })
          }
        } else {
          // 收起小地图
          mapContainer.style.display = 'none'
          button.innerHTML = '🗺️'
          button.title = '展开地图概览'
          isExpanded = false
        }
      }

      // 添加点击事件
      button.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleMiniMap()
      })

      return new Control({ element })
    },
    createToolControl() {
      const element = document.createElement('div')
      element.className = 'custom-tool-control ol-unselectable ol-control'
      element.innerHTML = `
        <div class="control-panel">
          <div class="control-title">地图工具 (Tools)</div>
          <div class="control-content">
            <button type="button" id="clear-markers" title="清除所有标记">🗑️ 清除标记</button>
            <button type="button" id="export-image" title="导出地图为图片">📷 导出图片</button>
            <button type="button" id="location-btn" title="定位到当前位置">📍 我的位置</button>
            <button type="button" id="measure-btn" title="距离测量工具">📏 测量距离</button>
          </div>
        </div>
      `

      // 添加事件监听
      element.addEventListener('click', (e) => {
        e.preventDefault()
        if (e.target.id === 'clear-markers') {
          this.clearAllMarkers()
        } else if (e.target.id === 'export-image') {
          this.exportMapImage()
        } else if (e.target.id === 'location-btn') {
          this.locateUser()
        } else if (e.target.id === 'measure-btn') {
          this.toggleMeasureTool()
        }
      })

      return new Control({ element })
    },

    // 添加瓦片加载监听器
    addTileLoadListeners(tileLayer) {
      const source = tileLayer.getSource()

      // 监听瓦片开始加载
      source.on('tileloadstart', () => {
        this.tilesLoaded = false
      })

      // 监听瓦片加载结束
      source.on('tileloadend', () => {
        if (!this.tilesLoaded) {
          console.log('瓦片加载完成')
          this.tilesLoaded = true
        }
      })

      // 监听瓦片加载错误，自动重试
      source.on('tileloaderror', (event) => {
        console.warn('瓦片加载失败，尝试重新加载:', event)
        // 延迟重试
        setTimeout(() => {
          event.tile.load()
        }, 1000)
      })
    },

    // 异步加载中国地图边界数据（优化版本）
    async loadChinaData() {
      try {
        // 显示加载提示
        console.log('开始加载中国地图数据...')

        // 从阿里云DataV获取中国地图GeoJSON数据（免费公开API）
        const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')

        if (!response.ok) {
          throw new Error(`HTTP错误: ${response.status}`)
        }

        const geojsonData = await response.json()

        // 创建GeoJSON格式解析器
        const format = new GeoJSON()

        // 分批处理要素，避免阻塞UI线程
        const features = format.readFeatures(geojsonData, {
          featureProjection: 'EPSG:3857' // Web墨卡托投影（OpenLayers默认）
        })

        // 使用 requestAnimationFrame 分批添加要素，避免UI阻塞
        this.addFeaturesInBatches(features, 50)  // 每批50个要素

        console.log(`成功加载 ${features.length} 个地理要素`)

      } catch (error) {
        console.error('加载中国地图数据失败:', error)
        this.$message && this.$message.error('加载地图数据失败')
      }
    },

    // 分批添加要素到图层，避免UI阻塞
    addFeaturesInBatches(features, batchSize = 50) {
      let index = 0

      const addBatch = () => {
        const batch = features.slice(index, index + batchSize)
        if (batch.length > 0) {
          // 添加当前批次的要素
          this.chinaLayer.getSource().addFeatures(batch)
          index += batchSize

          // 如果还有更多要素，继续下一批
          if (index < features.length) {
            requestAnimationFrame(addBatch)
          } else {
            // 所有要素添加完成，调整地图视图
            this.fitMapView()
          }
        }
      }

      // 开始添加第一批
      requestAnimationFrame(addBatch)
    },

    // 调整地图视图以适应中国边界
    fitMapView() {
      try {
        const extent = this.chinaLayer.getSource().getExtent()
        this.map.getView().fit(extent, {
          padding: [20, 20, 20, 20],  // 边距
          duration: 800,              // 减少动画时长
          maxZoom: 6                  // 限制最大缩放级别
        })
        console.log('地图视图调整完成')
      } catch (error) {
        console.error('调整地图视图失败:', error)
      }
    },

    // 处理搜索功能
    handleSearch() {
      // 验证输入不能为空
      if (!this.searchKeyword.trim()) {
        this.$message && this.$message.warning('请输入搜索关键词')
        return
      }

      // 去除首尾空格并搜索城市
      const keyword = this.searchKeyword.trim()
      const foundCity = this.findCity(keyword)

      if (foundCity) {
        // 找到城市：缩放到该城市并显示信息
        this.zoomToCity(foundCity)
        this.selectedCity = {
          ...foundCity,
          coordinates: `${foundCity.coordinates[0].toFixed(4)}, ${foundCity.coordinates[1].toFixed(4)}`
        }
        this.$message && this.$message.success(`找到城市：${foundCity.name}`)
      } else {
        // 未找到城市：显示错误信息
        this.$message && this.$message.error(`未找到相关城市：${keyword}`)
      }
    },

    // 在城市数据库中查找匹配的城市
    findCity(keyword) {
      return this.cityDatabase.find(city => {
        // 支持三种搜索方式：城市名、省份名、省份+城市名
        return city.name.includes(keyword) ||
               city.province.includes(keyword) ||
               `${city.province}${city.name}`.includes(keyword)
      })
    },

    // 缩放到指定城市并添加标记（优化版本）
    zoomToCity(city) {
      // 如果正在动画中，取消之前的动画
      if (this.isAnimating) {
        this.map.getView().cancelAnimations()
      }

      // 清除之前的标记
      this.markerLayer.getSource().clear()

      // 创建城市位置标记（点要素）
      const marker = new Feature({
        geometry: new Point(fromLonLat(city.coordinates))  // 将经纬度转换为地图坐标
      })

      // 将标记添加到标记图层
      this.markerLayer.getSource().addFeature(marker)

      // 设置动画状态
      this.isAnimating = true

      // 城市搜索使用固定缩放级别，避免过度缩放
      const targetZoom = 12  // 城市级别的合适缩放

      // 优化的缩放动画：减少动画时长，使用easeOut缓动
      this.map.getView().animate({
        center: fromLonLat(city.coordinates),  // 目标中心点
        zoom: targetZoom,                      // 固定缩放级别
        duration: 500,                         // 适中的动画时长
        easing: (t) => 1 - Math.pow(1 - t, 3)  // easeOut缓动函数，更流畅
      }, () => {
        // 动画完成回调
        this.isAnimating = false
      })
    },

    // 关闭信息面板并清除标记
    closeInfoPanel() {
      this.selectedCity = null      // 清除搜索城市信息
      this.clickedLocation = null   // 清除点击位置信息
      this.markerLayer.getSource().clear()  // 清除地图标记
    },

    // 添加地图点击事件监听器（优化版本）
    addMapClickListener() {
      this.map.on('singleclick', (event) => {
        // 使用防抖优化，避免快速点击造成性能问题
        this.debouncedHandleClick(event)
      })
    },

    // 防抖处理点击事件
    debouncedHandleClick(event) {
      // 清除之前的定时器
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }

      // 设置新的定时器，300ms后执行
      this.debounceTimer = setTimeout(() => {
        // 获取点击位置的地图坐标
        const coordinate = event.coordinate
        // 将地图坐标转换为经纬度
        const lonLat = toLonLat(coordinate)

        // 处理点击事件
        this.handleMapClick(lonLat, coordinate)
      }, 300)
    },

    // 处理地图点击事件（优化版本）
    async handleMapClick(lonLat, coordinate) {
      // 如果正在动画中，取消之前的动画
      if (this.isAnimating) {
        this.map.getView().cancelAnimations()
      }

      // 清除之前的标记
      this.markerLayer.getSource().clear()

      // 在点击位置添加新标记
      const marker = new Feature({
        geometry: new Point(coordinate)
      })
      this.markerLayer.getSource().addFeature(marker)

      // 设置动画状态
      this.isAnimating = true

      // 智能缩放策略：限制最大缩放级别避免县级过度缩放
      const currentZoom = this.map.getView().getZoom()
      let targetZoom

      if (currentZoom < 8) {
        targetZoom = 8   // 市级
      } else if (currentZoom < 10) {
        targetZoom = 10  // 区县级
      } else {
        targetZoom = Math.min(currentZoom + 1, 14)  // 限制最大到14级，避免过度缩放
      }

      this.map.getView().animate({
        center: coordinate,
        zoom: targetZoom,
        duration: 300,  // 进一步减少动画时长
        easing: (t) => t * t * (3 - 2 * t)  // smoothstep缓动，更平滑
      }, () => {
        // 动画完成回调
        this.isAnimating = false
      })

      // 异步获取点击位置的详细信息（不阻塞UI）
      this.getLocationInfoAsync(lonLat)
    },

    // 异步获取位置信息，不阻塞UI
    async getLocationInfoAsync(lonLat) {
      // 立即显示基础信息，提升用户体验
      this.clickedLocation = {
        name: '获取中...',
        province: '定位中',
        coordinates: `${lonLat[0].toFixed(4)}, ${lonLat[1].toFixed(4)}`,
        description: '正在查询位置信息',
        address: '加载中...'
      }
      // 清除搜索选中的城市，显示点击的位置信息
      this.selectedCity = null

      // 使用 requestIdleCallback 在浏览器空闲时获取详细信息
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          this.getLocationInfo(lonLat)
        })
      } else {
        // 降级方案：使用 setTimeout
        setTimeout(() => {
          this.getLocationInfo(lonLat)
        }, 100)
      }
    },

    // 通过逆地理编码获取位置信息
    async getLocationInfo(lonLat) {
      try {
        // 先显示加载状态
        this.clickedLocation = {
          name: '正在获取位置信息...',
          province: '加载中',
          coordinates: `${lonLat[0].toFixed(4)}, ${lonLat[1].toFixed(4)}`,
          description: '正在查询详细信息',
          address: '查询中...'
        }

        // 使用OpenStreetMap的Nominatim API进行逆地理编码（免费且无需API密钥）
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lonLat[1]}&lon=${lonLat[0]}&accept-language=zh-CN`)

        if (response.ok) {
          const data = await response.json()
          if (data && data.address) {
            const address = data.address

            // 解析API返回的地址信息并格式化
            this.clickedLocation = {
              name: address.city || address.town || address.village || address.county || '未知区域',
              province: address.state || address.province || '未知省份',
              city: address.city || address.town || address.county || '',
              district: address.suburb || address.district || '',
              coordinates: `${lonLat[0].toFixed(4)}, ${lonLat[1].toFixed(4)}`,
              address: data.display_name || '地址未知',
              description: `${address.country || '中国'} ${address.state || ''} ${address.city || address.town || address.county || ''}`
            }
          } else {
            throw new Error('无法获取位置信息')
          }
        } else {
          throw new Error('API请求失败')
        }
      } catch (error) {
        console.error('获取位置信息失败:', error)

        // API失败时的降级方案：使用本地城市数据库查找最近的城市
        const nearestCity = this.findNearestCity(lonLat)

        this.clickedLocation = {
          name: nearestCity ? `${nearestCity.name}附近` : '未知位置',
          province: nearestCity ? nearestCity.province : '未知省份',
          coordinates: `${lonLat[0].toFixed(4)}, ${lonLat[1].toFixed(4)}`,
          description: nearestCity ? `距离${nearestCity.name}约${this.calculateDistance(lonLat, nearestCity.coordinates).toFixed(1)}公里` : '位置信息获取失败，可能是网络问题',
          address: '详细地址暂不可用'
        }
      }

      // 显示点击位置信息，隐藏搜索城市信息
      this.selectedCity = null
    },

    // 在本地城市数据库中查找最近的城市
    findNearestCity(lonLat) {
      let nearestCity = null
      let minDistance = Infinity  // 初始化为无穷大

      // 遍历所有城市，计算距离并找到最近的
      this.cityDatabase.forEach(city => {
        const distance = this.calculateDistance(lonLat, city.coordinates)
        if (distance < minDistance) {
          minDistance = distance
          nearestCity = city
        }
      })

      return nearestCity
    },

    // 使用Haversine公式计算两点间的球面距离（公里）
    calculateDistance(coord1, coord2) {
      const R = 6371 // 地球半径（公里）
      const dLat = this.toRadians(coord2[1] - coord1[1])  // 纬度差
      const dLon = this.toRadians(coord2[0] - coord1[0])  // 经度差

      // Haversine公式核心计算
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.toRadians(coord1[1])) * Math.cos(this.toRadians(coord2[1])) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

      return R * c  // 返回距离（公里）
    },

    // 角度转弧度的工具函数
    toRadians(degrees) {
      return degrees * (Math.PI/180)
    },

    // 性能监控方法
    logPerformance(operation, startTime) {
      const endTime = performance.now()
      const duration = endTime - startTime
      console.log(`${operation} 耗时: ${duration.toFixed(2)}ms`)

      // 如果操作耗时超过100ms，记录警告
      if (duration > 100) {
        console.warn(`⚠️ ${operation} 性能警告: ${duration.toFixed(2)}ms`)
      }
    },

    // 自定义控件功能实现

    // 清除所有标记
    clearAllMarkers() {
      this.markerLayer.getSource().clear()
      this.selectedCity = null
      this.clickedLocation = null
      this.$message && this.$message.success('已清除所有标记')
    },

    // 导出地图图片 - 修复跨域问题
    exportMapImage() {
      try {
        // 等待地图渲染完成
        this.map.once('rendercomplete', () => {
          // 创建canvas
          const canvas = document.createElement('canvas')
          const size = this.map.getSize()
          canvas.width = size[0]
          canvas.height = size[1]
          const context = canvas.getContext('2d')

          // 添加白色背景
          context.fillStyle = '#ffffff'
          context.fillRect(0, 0, canvas.width, canvas.height)

          // 获取地图viewport中的所有canvas元素
          const mapCanvas = this.map.getViewport().querySelector('.ol-layer canvas')

          if (mapCanvas && mapCanvas.width > 0) {
            try {
              // 直接绘制地图canvas到导出canvas
              context.drawImage(mapCanvas, 0, 0)

              // 添加水印信息
              context.fillStyle = 'rgba(0, 0, 0, 0.7)'
              context.font = '12px Arial'
              context.fillText('© 高德地图 - 导出时间: ' + new Date().toLocaleString(), 10, canvas.height - 10)

              // 创建下载链接
              const link = document.createElement('a')
              link.download = `地图截图_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`
              link.href = canvas.toDataURL('image/png')
              link.click()

              this.$message && this.$message.success('地图图片已下载')
            } catch (e) {
              console.error('Canvas绘制错误:', e)
              this.fallbackExportImage()
            }
          } else {
            this.fallbackExportImage()
          }
        })

        // 触发渲染
        this.map.renderSync()

      } catch (error) {
        console.error('导出图片失败:', error)
        this.$message && this.$message.error('导出图片失败，请重试')
      }
    },

    // 备用导出方法
    fallbackExportImage() {
      try {
        // 使用html2canvas作为备用方案
        const mapElement = document.getElementById('map')

        // 简单的截屏方案
        if (typeof html2canvas !== 'undefined') {
          html2canvas(mapElement).then(canvas => {
            const link = document.createElement('a')
            link.download = `地图截图_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`
            link.href = canvas.toDataURL()
            link.click()
            this.$message && this.$message.success('地图图片已下载')
          })
        } else {
          // 最后的备用方案 - 提示用户手动截屏
          this.$message && this.$message.info('请使用浏览器的截图功能或按Ctrl+Shift+P截取地图')
        }
      } catch (error) {
        console.error('备用导出方法失败:', error)
        this.$message && this.$message.warning('自动导出失败，请使用浏览器截图功能')
      }
    },

    // 定位到用户当前位置
    locateUser() {
      if ('geolocation' in navigator) {
        this.$message && this.$message.info('正在定位，请稍候...')

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = [position.coords.longitude, position.coords.latitude]
            const userLocation = fromLonLat(coords)

            // 清除之前的标记
            this.markerLayer.getSource().clear()

            // 创建特殊的用户位置标记 - 内圈
            const marker = new Feature({
              geometry: new Point(userLocation),
              name: 'user-location'  // 标识这是用户位置标记
            })

            // 为用户位置设置特殊样式 - 红色标记
            marker.setStyle(new Style({
              image: new Circle({
                radius: 12,
                fill: new Fill({ color: '#ff4444' }),  // 红色填充
                stroke: new Stroke({
                  color: '#ffffff',
                  width: 3
                })
              })
            }))

            // 添加一个外圈动画效果 - 红色主题
            const outerCircle = new Feature({
              geometry: new Point(userLocation),
              name: 'user-location-outer'  // 标识这是外圈
            })
            outerCircle.setStyle(new Style({
              image: new Circle({
                radius: 25,  // 增大外圈半径
                fill: new Fill({ color: 'rgba(255, 68, 68, 0.15)' }),  // 更淡的红色半透明
                stroke: new Stroke({
                  color: '#ff4444',  // 红色边框
                  width: 2,
                  lineDash: [8, 4]  // 调整虚线样式
                })
              })
            }))

            // 先添加外圈，再添加内圈，确保层级正确
            this.markerLayer.getSource().addFeature(outerCircle)
            this.markerLayer.getSource().addFeature(marker)

            // 确保标记图层可见
            this.markerLayer.setVisible(true)

            // 缩放到用户位置
            this.map.getView().animate({
              center: userLocation,
              zoom: 15,
              duration: 1000
            })

            this.selectedCity = null
            this.clickedLocation = {
              name: '📍 我的位置',
              coordinates: `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`,
              description: '通过GPS定位获取的当前位置',
              address: '当前地理位置',
              accuracy: `定位精度: ±${position.coords.accuracy.toFixed(0)}米`
            }

            this.$message && this.$message.success('定位成功！已标注您的当前位置')
          },
          (error) => {
            console.error('定位失败:', error)
            let errorMsg = '定位失败'
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMsg = '定位权限被拒绝，请在浏览器设置中允许位置权限'
                break
              case error.POSITION_UNAVAILABLE:
                errorMsg = '位置信息不可用，请检查GPS或网络连接'
                break
              case error.TIMEOUT:
                errorMsg = '定位超时，请重试'
                break
            }
            this.$message && this.$message.error(errorMsg)
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,        // 增加超时时间
            maximumAge: 300000
          }
        )
      } else {
        this.$message && this.$message.error('您的浏览器不支持地理定位功能')
      }
    },

    // 测量距离工具
    toggleMeasureTool() {
      // 这里可以实现距离测量功能
      this.$message && this.$message.info('距离测量功能开发中，敬请期待')
    }
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

.search-container {
  position: absolute;
  top: 20px;
  left: 100px;
  z-index: 1000;
  width: 300px;

  .search-input {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}

.info-panel {
  position: absolute;
  top: 80px;
  left: 100px;
  z-index: 1000;
  width: 300px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;

  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 12px;
    margin-bottom: 12px;

    h3 {
      margin: 0;
      color: #333;
      font-size: 18px;
    }
  }

  .info-content {
    p {
      margin: 8px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.5;

      strong {
        color: #333;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .search-container,
  .info-panel {
    width: calc(100% - 40px);
    left: 20px;
    right: 20px;
  }
}

// 地图控件样式优化
::v-deep .ol-control {
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 6px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}

// 自定义缩放控件样式
::v-deep .custom-zoom {
  top: 100px !important;
  left: 20px !important;

  button {
    width: 40px !important;
    height: 40px !important;
    font-size: 18px !important;
    font-weight: bold !important;
    border-radius: 6px !important;
    margin: 2px !important;

    &:hover {
      background: #f0f0f0 !important;
      transform: scale(1.05);
    }
  }
}

// 缩放滑块样式
::v-deep .custom-zoom-slider {
  top: 100px !important;
  left: 70px !important;
  // height: 200px;

  .ol-zoom-slider {
    background: rgba(255, 255, 255, 0.9) !important;
    border-radius: 6px !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  }

  // 滑块轨道
  .ol-zoom-slider-thumb {
    background: #ffffff !important;
    border: 2px solid #007bff !important;
    border-radius: 50% !important;
    width: 18px !important;
    height: 18px !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25) !important;
    transition: all 0.2s ease !important;
    position: relative !important;

    // 添加中心白色标识
    &::before {
      content: '' !important;
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      width: 8px !important;
      height: 8px !important;
      background: #ffffff !important;
      border-radius: 50% !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
      z-index: 2 !important;
    }

    &:hover {
      border-color: #0056b3 !important;
      transform: scale(1.1) !important;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3) !important;

      &::before {
        background: #f8f9fa !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4) !important;
      }
    }

    &:active {
      border-color: #004085 !important;
      transform: scale(0.95) !important;

      &::before {
        background: #e9ecef !important;
      }
    }
  }

  // 滑块按钮
  button {
    background: rgba(255, 255, 255, 0.9) !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    border-radius: 4px !important;
    width: 18px !important;
    height: 18px !important;
    margin: 2px !important;

    &:hover {
      background: #f0f0f0 !important;
      border-color: #007bff !important;
    }
  }
}

// 比例尺样式
::v-deep .custom-scale-line {
  bottom: 20px !important;
  left: 20px !important;
  background: rgba(255, 255, 255, 0.9) !important;
  padding: 5px 10px !important;

  .ol-scale-line-inner {
    border: 2px solid #333 !important;
    border-top: none !important;
    color: #333 !important;
    font-weight: bold !important;
    font-size: 12px !important;
  }
}

// 鼠标位置样式
::v-deep .custom-mouse-position {
  position: fixed !important;
  bottom: 20px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  background: rgba(255, 255, 255, 0.95) !important;
  padding: 8px 16px !important;
  font-family: 'Monaco', 'Courier New', monospace !important;
  font-size: 13px !important;
  color: #333 !important;
  min-width: 250px !important;
  text-align: center !important;
  border-radius: 6px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  white-space: nowrap !important;
  z-index: 1000 !important;
  display: block !important;
  visibility: visible !important;
}

// 全屏控件样式
::v-deep .custom-fullscreen {
  top: 100px !important;
  right: 20px !important;

  button {
    width: 40px !important;
    height: 40px !important;
    font-size: 16px !important;
    border-radius: 6px !important;

    &:hover {
      background: #f0f0f0 !important;
      transform: scale(1.05);
    }
  }
}

// 缩放到范围控件样式
::v-deep .custom-zoom-extent {
  top: 150px !important;
  right: 20px !important;

  button {
    width: 40px !important;
    height: 40px !important;
    font-size: 16px !important;
    border-radius: 6px !important;

    &:hover {
      background: #f0f0f0 !important;
      transform: scale(1.05);
    }
  }
}

// 版权信息样式
::v-deep .custom-attribution {
  bottom: 60px !important;
  right: 20px !important;
  max-width: 300px !important;

  ul {
    color: #666 !important;
    font-size: 11px !important;
  }

  button {
    background: rgba(255, 255, 255, 0.9) !important;
    border-radius: 4px !important;
  }
}

// 自定义小地图样式
::v-deep .custom-mini-map {
  bottom: 100px !important;
  left: 20px !important;
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 6px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;

  .mini-map-toggle {
    background: rgba(255, 255, 255, 0.9) !important;
    border: 1px solid #ccc !important;
    border-radius: 4px !important;
    width: 30px !important;
    height: 30px !important;
    cursor: pointer !important;
    font-size: 14px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;

    &:hover {
      background: #f0f0f0 !important;
      border-color: #007bff !important;
    }

    &:active {
      background: #e0e0e0 !important;
    }
  }

  .mini-map-container {
    width: 150px !important;
    height: 150px !important;
    border: 2px solid #333 !important;
    border-radius: 6px !important;
    margin-top: 5px !important;
    background: white !important;

    // 确保小地图内容正确显示
    .ol-viewport {
      border-radius: 4px !important;
    }
  }
}

// 原来的鹰眼图样式 - 保留以防需要
::v-deep .custom-overview-map {
  bottom: 100px !important;
  left: 20px !important;
  width: 150px !important;
  height: 150px !important;
  background: white !important;

  // 折叠按钮样式
  button {
    background: rgba(255, 255, 255, 0.9) !important;
    border-radius: 4px !important;
    z-index: 100 !important;
    position: relative !important;
    pointer-events: auto !important;
    cursor: pointer !important;
    border: 1px solid #ccc !important;
    width: 20px !important;
    height: 20px !important;
    font-size: 12px !important;
    display: block !important;

    &:hover {
      background: #f0f0f0 !important;
      border-color: #007bff !important;
    }

    &:active {
      background: #e0e0e0 !important;
    }
  }

  // 确保折叠状态下按钮可见
  &.ol-collapsed button {
    display: block !important;
  }

  .ol-overviewmap-map {
    border: 2px solid #333 !important;
    border-radius: 6px !important;
    background: #f0f0f0 !important;
    width: 100% !important;
    height: 100% !important;
  }

  // 强制显示小地图内容
  .ol-overviewmap-map .ol-viewport {
    background: white !important;
  }

  // 确保canvas元素正确渲染
  .ol-overviewmap-map canvas {
    width: 100% !important;
    height: 100% !important;
  }

  // 视图框样式
  .ol-overviewmap-box {
    border: 2px solid #007bff !important;
    background: rgba(0, 123, 255, 0.1) !important;
  }
}

// 自定义控件面板通用样式
::v-deep .custom-layer-switcher,
::v-deep .custom-tool-control {
  top: 200px !important;
  right: 20px !important;
  margin-bottom: 10px !important;
  min-width: 200px !important;

  .control-panel {
    padding: 12px !important;
    background: rgba(255, 255, 255, 0.95) !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;

    .control-title {
      font-weight: bold !important;
      font-size: 14px !important;
      color: #333 !important;
      margin-bottom: 10px !important;
      padding-bottom: 8px !important;
      border-bottom: 1px solid #e0e0e0 !important;
    }

    .control-content {
      label {
        display: block !important;
        margin: 8px 0 !important;
        cursor: pointer !important;
        font-size: 13px !important;
        color: #555 !important;

        input[type="checkbox"] {
          margin-right: 8px !important;
        }

        &:hover {
          color: #333 !important;
        }
      }

      button {
        display: block !important;
        width: 100% !important;
        padding: 8px 12px !important;
        margin: 6px 0 !important;
        background: #fff !important;
        border: 1px solid #ddd !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 13px !important;
        color: #555 !important;
        transition: all 0.2s ease !important;

        &:hover {
          background: #f8f9fa !important;
          border-color: #007bff !important;
          color: #007bff !important;
          transform: translateY(-1px);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }
  }
}

// 工具控件位置调整
::v-deep .custom-tool-control {
  top: 320px !important;
}
</style>