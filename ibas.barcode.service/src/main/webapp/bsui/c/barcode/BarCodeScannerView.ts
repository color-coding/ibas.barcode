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
            export class BarCodeScannerView extends ibas.BOResidentView implements app.IBarCodeScannerView {
                // 扫描
                scanEvent: Function;
                /** 绘制工具条视图 */
                drawBar(): any {
                    let that: this = this;
                    // 不重复创建工具条钮
                    if (ibas.objects.isNull(this.bar)) {
                        this.bar = new sap.m.Button("", {
                            icon: "sap-icon://sort-descending",
                            tooltip: this.title,
                            type: sap.m.ButtonType.Transparent,
                            press: function (): void {
                                that.fireViewEvents(that.showFullViewEvent);
                            }
                        });
                    }
                    return this.bar;
                }
                private bar: sap.m.Button;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    return new sap.m.Dialog("", {
                        title: this.title,
                        type: sap.m.DialogType.Standard,
                        state: sap.ui.core.ValueState.None,
                        stretchOnPhone: true,
                        horizontalScrolling: true,
                        verticalScrolling: true,
                        content: [
                            new sap.ui.core.HTML("", {
                                content: "<div id=\"bar_code_scanner\"></div>",
                                preferDOM: false,
                                sanitizeContent: true,
                                visible: true,
                            })
                        ],
                        buttons: [
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_exit"),
                                type: sap.m.ButtonType.Transparent,
                                // icon: "sap-icon://inspect-down",
                                press: function (): void {
                                    that.fireViewEvents(that.closeEvent);
                                }
                            }),
                        ]
                    });
                }
                // 显示屏幕
                showScanner(type: app.emBarCodeType): void {
                    if (type === app.emBarCodeType.BAR_CODE) {
                        this.scanBarCode();
                    } else if (type === app.emBarCodeType.QR_CODE) {
                        this.scanQRCode();
                    }
                }
                // 扫描条码
                scanBarCode(): void {
                    let that: this = this;
                    let libraries: string[] = [];
                    if (ibas.config.get(ibas.CONFIG_ITEM_DEBUG_MODE, false)) {
                        libraries.push("3rdparty/quagga");
                    } else {
                        libraries.push("3rdparty/quagga.min");
                    }
                    // 使用此模块库加载器
                    let require: Require = ibas.requires.create({
                        context: ibas.requires.naming(CONSOLE_NAME),
                    });
                    require(libraries,
                        function (): void {
                            (<any>window).Quagga.init({
                                inputStream: {
                                    name: "Live",
                                    type: "LiveStream",
                                    target: document.querySelector("#bar_code_scanner")
                                },
                                decoder: {
                                    readers: ["code_128_reader"]
                                }
                            }, function (err: any): void {
                                if (err) {
                                    ibas.logger.log(ibas.emMessageLevel.ERROR, err);
                                    return;
                                }
                                ibas.logger.log("Quagga: ready to start.");
                                (<any>window).Quagga.start();
                                (<any>window).Quagga.onDetected(function (data: any): void {
                                    that.fireViewEvents(that.scanEvent, data.codeResult.code);
                                });
                            });
                        },
                        function (err: RequireError): void {
                            // 类库加载失败
                            that.application.viewShower.messages({
                                type: ibas.emMessageType.ERROR,
                                title: err.name,
                                message: err.message,
                            });
                        }
                    );
                }
                // 扫描二维码
                scanQRCode(): void {
                    let that: this = this;
                    let libraries: string[] = [];
                }
                /** 关闭之后 */
                onClosed(): void {
                    if (!ibas.objects.isNull((<any>window).Quagga)) {
                        (<any>window).Quagga.stop();
                        // (<any>window).Quagga.offDetected(this.onDetected);
                    }
                }
            }
        }
    }
}