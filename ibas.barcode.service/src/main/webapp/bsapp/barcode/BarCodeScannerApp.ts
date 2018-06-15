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
                ibas.servicesManager.runApplicationService<IBarCodeScannerContract, string>({
                    proxy: new BarCodeScannerServiceProxy({
                        scanType: emBarCodeType.ALL
                    }),
                    onCompleted(result: string): void {
                        that.proceeding("scan code:" + result);
                    }
                });
            }
        }
    }
}