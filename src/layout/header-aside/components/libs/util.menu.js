/**
 * @description 创建菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 */
export function elMenuItem (h, menu, menuIds) {
  let icon = null
  if (menu.icon) icon = <i class={`iconfont-${menu.icon}`} />
  else if (menu.iconSvg) icon = <d2-icon-svg name={menu.iconSvg} />
  else icon = <i class="iconfont icon-file-o" />
  // 基金投顾、基金经理增加外链icon
  let afterIconFlag = ['1385071203420221026', '1385071203408674825', '1853325732562145281'].includes(menu.id)
  let dot = menuIds.includes(menu.id) ? (<span class="icon-dot"/>) : null

  return <el-tooltip content={this.$t('menuOpenExternal')} placement="right" disabled={!afterIconFlag}>
    <el-menu-item
      key={menu.path}
      index={menu.whitePath ? `${menu.path},${menu.whitePath}` : menu.path}>
      {icon}
      <span slot="title" >
        <span>{(menu.titleKey ? this.$t(menu.titleKey) : menu.title) || this.$t('commonUnnamedMenu')}{dot}{afterIconFlag ? <i class="iconfont-lianjie jgt-ml-8"/> : ''}</span>
      </span>
    </el-menu-item>
  </el-tooltip>
}

/**
 * @description 创建子菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 */
export function elSubmenu (h, menu, menuIds) {
  let icon = null
  if (menu.icon) icon = <i slot="title" class={`iconfont-${menu.icon}`} />
  else if (menu.iconSvg) icon = <d2-icon-svg slot="title" name={menu.iconSvg} />
  else icon = <i slot="title" class="iconfont icon-folder-o" />
  return <el-submenu
    key={menu.path}
    index={menu.path}>
    {icon}
    <span slot="title">{(menu.titleKey ? this.$t(menu.titleKey) : menu.title) || this.$t('commonUnnamedMenu')}</span>
    {menu.children.map(child => createMenu.call(this, h, child, menuIds))}
  </el-submenu>
}

/**
 * @description 在组件中调用此方法渲染菜单项目
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 */
export function createMenu (h, menu, menuIds) {
  if (menu.children === undefined) return elMenuItem.call(this, h, menu, menuIds)
  return elSubmenu.call(this, h, menu, menuIds)
}
