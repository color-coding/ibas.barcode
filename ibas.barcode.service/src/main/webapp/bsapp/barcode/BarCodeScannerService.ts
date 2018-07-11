/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace barcode {
    export namespace app {
        /** 条码/二维码扫描服务 */
        export class BarCodeScannerService extends ibas.ServiceWithResultApplication<IBarCodeScannerView, IBarCodeScannerContract, IScanResult> {
            /** 应用标识 */
            static APPLICATION_ID: string = "21f27f92-416e-4127-b9f5-005e8dd4110d";
            /** 应用名称 */
            static APPLICATION_NAME: string = "barcode_service_barcodescanner";
            /** 构造函数 */
            constructor() {
                super();
                this.id = BarCodeScannerService.APPLICATION_ID;
                this.name = BarCodeScannerService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 运行服务 */
            runService(contract: IBarCodeScannerContract): void {
                let that: this = this;
                let methods: ibas.IList<ScanMethod> = scanMethods();
                let method: ScanMethod = methods.firstOrDefault(c => c.enabled);
                if (!ibas.objects.isNull(method)) {
                    method.scan({
                        onCompleted(result: IScanResult): void {
                            that.fireCompleted(result);
                        }
                    });
                } else {
                    if (ibas.objects.isNull(contract.scanType)) {
                        this.scanType = emBarCodeType.ALL;
                    } else {
                        this.scanType = contract.scanType;
                    }
                    this.show();
                }
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.scanEvent = this.scan;
            }
            private scanType: emBarCodeType;
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                this.view.showScanner(this.scanType);
            }
            /** 关闭视图 */
            close(): void {
                this.view.reset();
                super.close();
            }
            private scan(result: IScanResult): void {
                this.fireCompleted(result);
            }
        }
        /** 视图-条码扫描 */
        export interface IBarCodeScannerView extends ibas.IResidentView {
            // 扫描
            scanEvent: Function;
            // 显示屏幕
            showScanner(type: emBarCodeType): void;
            // 复位
            reset(): void;
        }
        /** 条码/二维码扫描服务 */
        export class BarCodeScannerServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = BarCodeScannerService.APPLICATION_ID;
                this.name = BarCodeScannerService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
                this.proxy = BarCodeScannerServiceProxy;
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new BarCodeScannerService();
            }
        }
    }
}