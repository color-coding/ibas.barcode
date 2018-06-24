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
                        if (result.cancelled) {
                            // 用户取消扫码,不处理
                        } else {
                            let moduleConsole: ibas.ModuleConsole;
                            for (let i: number = 0; i < shell.app.consoleManager.modules().length; i++) {
                                let console: ibas.IModule = shell.app.consoleManager.modules()[i];
                                if (console instanceof ibas.ModuleConsole) {
                                    if (console.id === CONSOLE_ID) {
                                        moduleConsole = console;
                                    }
                                }
                            }
                            if (!ibas.objects.isNull(moduleConsole)) {
                                if (ibas.objects.isNull(result.error)) {
                                    moduleConsole.viewShower.proceeding(null,
                                        ibas.emMessageType.INFORMATION, "scan code:" + result.text);
                                } else {
                                    moduleConsole.viewShower.proceeding(null,
                                        ibas.emMessageType.ERROR, "scan code Error:" + result.error.message);
                                }
                            }
                        }
                    }
                });
                return null;
            }
        }
    }
}