/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace barcode {
    export namespace app {
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
                ibas.servicesManager.runApplicationService<IBarCodeScannerContract, IScanResult>({
                    proxy: new BarCodeScannerServiceProxy({
                        scanType: emBarCodeType.ALL
                    }),
                    onCompleted(scanResult: IScanResult): void {
                        let eventType: string = ibas.enums.toString(ibas.emBrowserEventType, ibas.emBrowserEventType.SCAN).toLowerCase();
                        let scanEvent: CustomEvent = new CustomEvent(eventType, {
                            detail: scanResult,
                        });
                        // 此处触发自定义事件-扫码
                        // 在监听事件中判断scanEvent.cancelBubble,为真代表其他监听事件已处理过扫码结果
                        // 通过scanEvent.detail.text修改扫码结果
                        // 通过scanEvent.cancelBubble通知其他监听事件,扫码结果已被处理
                        ibas.browserEventManager.fireEvent(ibas.emBrowserEventType.SCAN, scanEvent);
                        let result: IScanResult = scanEvent.detail;
                        if (result.cancelled) {
                            // 用户取消扫码,不处理
                        } else {
                            if (ibas.objects.isNull(result.error)) {
                                let text: string = result.text;
                                text = text.indexOf("#") > -1 ? text.substring(text.indexOf("#")) : text;
                                ibas.urls.changeHash(text);
                            } else {
                                that.proceeding(ibas.emMessageType.ERROR, "scan code Error:" + result.error.message);
                            }
                        }
                    }
                });
            }
        }
    }
}