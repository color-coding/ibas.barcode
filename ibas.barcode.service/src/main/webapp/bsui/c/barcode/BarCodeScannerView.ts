﻿/**
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
                    let dialog: sap.m.Dialog = new sap.m.Dialog("", {
                        title: this.title,
                        type: sap.m.DialogType.Standard,
                        state: sap.ui.core.ValueState.None,
                        stretchOnPhone: true,
                        horizontalScrolling: true,
                        verticalScrolling: true,
                        content: [
                            new sap.ui.core.HTML("", {
                                content: "<div id=\"bar_code_scanner\"><video id=\"video\" style=\"border: 1px solid gray\"></video></div>",
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
                    // sap.m.Dialog的buttons属性中只能添加Button,这里重写其校验方法
                    // sap.ui.unified.FileUploader上传控件仅显示按钮时也可添加
                    let validateAggregation: Function = dialog.validateAggregation;
                    dialog.validateAggregation = function (sAggregationName: string, oObject: sap.ui.base.ManagedObject | any, bMultiple: boolean): any {
                        if (sAggregationName === "buttons" && oObject instanceof sap.ui.unified.FileUploader) {
                            // 仅显示按钮
                            if (oObject.getButtonOnly()) {
                                return oObject;
                            }
                        } else {
                            return validateAggregation.apply(dialog, arguments);
                        }
                    };
                    dialog.insertButton(<any>new sap.ui.unified.FileUploader("", {
                        buttonOnly: true,
                        buttonText: ibas.i18n.prop("barcode_btn_decodelocalimage"),
                        multiple: false,
                        uploadOnChange: false,
                        style: sap.m.ButtonType.Transparent,
                        width: "auto",
                        fileType: ["jpg", "jpeg", "png", "bmp"],
                        mimeType: ["image/jpeg", "image/png", "image/bmp"],
                        change: function (oEvent: sap.ui.base.Event): void {
                            let files: File[] = oEvent.getParameter("files");
                            if (ibas.objects.isNull(files) || files.length === 0) {
                                return;
                            }
                            let oURL: any = window.URL || (<any>window).webkitURL;
                            let imageUrl: string = oURL.createObjectURL(files[0]);
                            if (!ibas.objects.isNull(that.codeReader)) {
                                that.codeReader.decodeFromImage(undefined, imageUrl)
                                    .then((result) => {
                                        that.fireViewEvents(that.scanEvent, result.text);
                                    }).catch((err) => {
                                        // 解码失败
                                        that.application.viewShower.proceeding(that,
                                            ibas.emMessageType.ERROR,
                                            ibas.i18n.prop("barcode_msg_notfoundcode"),
                                        );
                                        that.decodeFromInputVideoDevice();
                                    });
                            }
                        },
                    }), 0);
                    return dialog;
                }
                codeReader: any;
                // 显示屏幕
                showScanner(type: app.emBarCodeType): void {
                    let that: this = this;
                    let libraries: string[] = [];
                    if (ibas.config.get(ibas.CONFIG_ITEM_DEBUG_MODE, false)) {
                        libraries.push("3rdparty/zxing");
                    } else {
                        libraries.push("3rdparty/zxing.min");
                    }
                    // 使用此模块库加载器
                    let require: Require = ibas.requires.create({
                        context: ibas.requires.naming(CONSOLE_NAME),
                    });
                    require(libraries,
                        function (zxing: any): void {
                            if (ibas.objects.isNull(that.codeReader)) {
                                if (ibas.objects.isNull(type)) {
                                    type = app.emBarCodeType.ALL;
                                }
                                switch (type) {
                                    case app.emBarCodeType.BAR_CODE:
                                        // 仅支持条码扫描
                                        that.codeReader = new zxing.BrowserBarcodeReader();
                                        break;
                                    case app.emBarCodeType.QR_CODE:
                                        // 仅支持二维码扫描
                                        that.codeReader = new zxing.BrowserQRCodeReader();
                                        break;
                                    case app.emBarCodeType.ALL:
                                    default:
                                        // 支持条码/二维码扫描
                                        that.codeReader = new zxing.BrowserMultiCodeReader();
                                        break;
                                }
                            }
                            that.decodeFromInputVideoDevice();
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
                // 从视频流中解码
                decodeFromInputVideoDevice(): void {
                    let that: this = this;
                    if (ibas.objects.isNull(that.codeReader)) {
                        return;
                    }
                    let firstDeviceId: any;
                    that.codeReader.getVideoInputDevices()
                        .then((videoInputDevices) => {
                            if (!!videoInputDevices && videoInputDevices.length > 0) {
                                firstDeviceId = videoInputDevices[0].deviceId;
                                that.codeReader.decodeFromInputVideoDevice(firstDeviceId, "video")
                                    .then((result) => {
                                        that.fireViewEvents(that.scanEvent, result.text);
                                    }).catch((err) => {
                                        // 解码失败
                                        that.application.viewShower.messages({
                                            type: ibas.emMessageType.ERROR,
                                            title: err.name,
                                            message: err.message,
                                        });
                                    });
                            } else {
                                // 没找到摄像头
                            }
                        });
                }
                /** 关闭之后 */
                onClosed(): void {
                    if (!ibas.objects.isNull(this.codeReader)) {
                        this.codeReader.reset();
                    }
                }
            }
        }
    }
}