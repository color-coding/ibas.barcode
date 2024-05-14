package org.colorcoding.ibas.barcode;

/**
 * 我的配置项
 */
public class MyConfiguration extends org.colorcoding.ibas.initialfantasy.MyConfiguration {

    /**
    * 模块标识
    */
    public static final String MODULE_ID = "41218cef-18b4-4399-ab3c-7ba37bf34b5c";

    /**
    * 命名空间
    */
    public static final String NAMESPACE_ROOT = "http://colorcoding.org/ibas/barcode/";

    /**
    * 数据命名空间
    */
    public static final String NAMESPACE_DATA = NAMESPACE_ROOT + "data";

    /**
    * 业务对象命名空间
    */
    public static final String NAMESPACE_BO = NAMESPACE_ROOT + "bo";

    /**
    * 服务命名空间
    */
    public static final String NAMESPACE_SERVICE = NAMESPACE_ROOT + "service";

    /**
     * 配置项目-文件文件夹
     */
    public final static String CONFIG_ITEM_BARCODE_FILE_FOLDER = "BCFileFolder";

}
