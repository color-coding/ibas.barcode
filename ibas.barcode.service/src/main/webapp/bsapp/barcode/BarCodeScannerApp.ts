/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace barcode {
    export namespace app {
        /** 配置项-启用扫码结果格式化 */
        const CONFIG_ITEM_ENABLE_SCAN_RESULT_FORMAT: string = "enableScanResultFormat";
        /** 配置项-启用扫码结果监听 */
        const CONFIG_ITEM_ENABLE_SCAN_RESULT_LISTEN: string = "enableScanResultListen";
        /** 应用-条码扫描 */
        export class BarCodeScannerApp extends ibas.ResidentApplication<IBarCodeScannerView> {
            /** 应用标识 */
            static APPLICATION_ID: string = "c9323d69-2116-44a3-94b1-4456df560928";
            /** 应用名称 */
            static APPLICATION_NAME: string = "barcode_app_barcodescanner";
            /** 构造函数 */
            constructor() {
                super();
                this.id = BarCodeScannerApp.APPLICATION_ID;
                this.name = BarCodeScannerApp.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
            }
            /** 激活完整视图 */
            protected showFullView(): void {
                let that: this = this;
                ibas.servicesManager.runApplicationService<IBarCodeScannerContract, IScanFormatResult>({
                    proxy: new BarCodeScannerServiceProxy({
                        scanType: emBarCodeType.ALL,
                        // 启用集成任务格式化
                        needFormat: ibas.config.get(CONFIG_ITEM_ENABLE_SCAN_RESULT_FORMAT, true)
                    }),
                    onCompleted(scanResult: IScanFormatResult): void {
                        let result: IScanFormatResult = scanResult;
                        if (result.cancelled) {
                            // 用户取消扫码,不处理
                        } else {
                            if (ibas.objects.isNull(result.error) && ibas.objects.isNull(result.formatError)) {
                                // 启用监听
                                if (ibas.config.get(CONFIG_ITEM_ENABLE_SCAN_RESULT_LISTEN, true)) {
                                    let eventType: string = ibas.enums.toString(ibas.emBrowserEventType, ibas.emBrowserEventType.SCAN).toLowerCase();
                                    let scanEvent: CustomEvent = new CustomEvent(eventType, {
                                        detail: scanResult,
                                    });
                                    // 此处触发自定义事件-扫码
                                    // 在监听事件中判断scanEvent.detail.formattedText,存在值已处理过扫码结果
                                    // 通过scanEvent.detail.formattedText返回格式化结果
                                    ibas.browserEventManager.fireEvent(ibas.emBrowserEventType.SCAN, scanEvent);
                                    result = scanEvent.detail;
                                }
                                let text: string = ibas.objects.isNull(result.formattedText) ? result.text : result.formattedText;
                                text = text.indexOf("#") > -1 ? text.substring(text.indexOf("#")) : text;
                                if (!ibas.strings.isEmpty(text) && text.startsWith("#")) {
                                    ibas.urls.changeHash(text);
                                } else {
                                    that.proceeding(ibas.emMessageType.INFORMATION, "scan code:" + result.text);
                                }
                            } else {
                                if (!ibas.objects.isNull(result.error)) {
                                    that.proceeding(ibas.emMessageType.ERROR, "scan code Error:" + result.error.message);
                                }
                                if (!ibas.objects.isNull(result.formatError)) {
                                    that.proceeding(ibas.emMessageType.WARNING, "scan code formatError:" + result.formatError.message);
                                }
                            }
                        }
                    }
                });
            }
        }
    }
}