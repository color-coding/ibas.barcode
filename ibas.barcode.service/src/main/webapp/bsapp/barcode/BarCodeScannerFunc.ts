/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace barcode {
    export namespace app {
        export class BarCodeScannerFunc extends ibas.ModuleFunction {

            /** 功能标识 */
            static FUNCTION_ID = "ad6ae084-65ac-4d48-8d13-2277f7c800b4";
            /** 功能名称 */
            static FUNCTION_NAME = "barcode_func_barcodescanner";
            /** 构造函数 */
            constructor() {
                super();
                this.id = BarCodeScannerFunc.FUNCTION_ID;
                this.name = BarCodeScannerFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                let that: this = this;
                ibas.servicesManager.runApplicationService<IBarCodeScannerContract, IScanResult>({
                    proxy: new BarCodeScannerServiceProxy({
                        scanType: emBarCodeType.ALL
                    }),
                    onCompleted(result: IScanResult): void {
                    }
                });
                return null;
            }
        }
    }
}