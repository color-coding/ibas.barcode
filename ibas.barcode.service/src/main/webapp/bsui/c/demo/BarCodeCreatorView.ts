/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace barcode {
    export namespace ui {
        export namespace c {
            /**
             * 视图-条码扫描
             */
            export class BarCodeCreatorView extends ibas.View implements app.IBarCodeCreatorView {
                /** 绘制视图 */
                draw(): any {
                    return new sap.m.Page("", {
                    });
                }
            }
        }
    }
}