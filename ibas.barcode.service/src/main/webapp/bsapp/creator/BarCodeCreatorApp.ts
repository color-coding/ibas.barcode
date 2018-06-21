/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

namespace barcode {
    export namespace app {

        /** 示例应用-生成条码/二维码 */
        export class BarCodeCreatorApp extends ibas.Application<IBarCodeCreatorView> {

            /** 应用标识 */
            static APPLICATION_ID: string = "a317b233-0d1b-4ba5-906f-044fa6567ad7";
            /** 应用名称 */
            static APPLICATION_NAME: string = "barcode_app_barcodecreator";
            /** 构造函数 */
            constructor() {
                super();
                this.id = BarCodeCreatorApp.APPLICATION_ID;
                this.name = BarCodeCreatorApp.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 运行 */
            run(): void {
                this.show();
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
            }
            private param: BarCodeCreatorParam;
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                this.param = new BarCodeCreatorParam();
                this.view.showParam(this.param);
            }
        }
        /** 示例视图-生成条码/二维码 */
        export interface IBarCodeCreatorView extends ibas.IView {

            // 显示参数
            showParam(param: BarCodeCreatorParam): void;
        }
    }
}
