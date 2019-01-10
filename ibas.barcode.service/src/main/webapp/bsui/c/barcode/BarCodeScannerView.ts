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
            export class BarCodeScannerView extends ibas.ResidentView implements app.IBarCodeScannerView {
                // 扫描
                scanEvent: Function;
                /** 绘制工具条视图 */
                drawBar(): any {
                    let that: this = this;
                    // 使用此模块库加载器
                    let require: Require = ibas.requires.create({
                        context: ibas.requires.naming(CONSOLE_NAME),
                    });
                    let imageUrl: string = "";
                    if (ibas.config.get(ibas.CONFIG_ITEM_PLANTFORM) !== ibas.emPlantform.PHONE
                        && ibas.config.get(openui5.CONFIG_ITEM_COMPACT_SCREEN, false)) {
                        imageUrl = require.toUrl("resources/images/scan.c.svg");
                    } else {
                        imageUrl = require.toUrl("resources/images/scan.m.svg");
                    }
                    return new sap.m.Button("", {
                        icon: imageUrl,
                        iconDensityAware: false,
                        tooltip: this.title,
                        type: sap.m.ButtonType.Transparent,
                        press: function (): void {
                            that.fireViewEvents(that.showFullViewEvent);
                        }
                    });
                }
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
                                content: "<div id=\"bar_code_scanner\"><video id=\"video\"></video></div>",
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
                                    that.fireViewEvents(that.scanEvent, {
                                        cancelled: true,
                                        text: undefined
                                    });
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
                                        that.fireViewEvents(that.scanEvent, {
                                            cancelled: false,
                                            text: result.text
                                        });
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
                    if (ibas.config.get(ibas.CONFIG_ITEM_PLANTFORM) === ibas.emPlantform.PHONE) {
                        // 移动端加个按钮撑一下空间,不然上传控件太靠左了
                        dialog.insertButton(new sap.m.Button("", {
                            type: sap.m.ButtonType.Transparent,
                        }), 0);
                    }
                    this.id = dialog.getId();
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
                                // 默认使用最后一个摄像头,后续改为可以切换
                                if (sap.ui.Device.system.tablet) {
                                    // 平板的第一个摄像头为后置摄像头
                                    firstDeviceId = videoInputDevices[0].deviceId;
                                } else {
                                    firstDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;
                                }
                                that.codeReader.decodeFromInputVideoDevice(firstDeviceId, "video")
                                    .then((result) => {
                                        that.fireViewEvents(that.scanEvent, {
                                            cancelled: false,
                                            text: result.text
                                        });
                                    }).catch((err) => {
                                        // 解码失败
                                        that.application.viewShower.messages({
                                            type: ibas.emMessageType.ERROR,
                                            title: err.name,
                                            message: err.message,
                                        });
                                    });
                                that.prettify();
                            } else {
                                // 没找到摄像头
                            }
                        });
                }
                /** 修饰/美化界面 */
                prettify(): void {
                    $("#video").css({
                        border: "1px solid gray"
                    });
                    let svgCss: string = "position:absolute;top:0;left:0;bottom:0;right:0;";
                    let rectCss: string = "fill:black;fill-opacity:0.6;";
                    let lineCss: string = "stroke:#30e630;stroke-width:3;stroke-linecap:round;";
                    let animateLineCss: string = "stroke:#30e630;stroke-width:2;fill-opacity:0.6;";
                    $("#bar_code_scanner").append(ibas.strings.format(
                        "<svg width='100%' height='100%' version='1.1' xmlns='http://www.w3.org/2000/svg' style='{0}'> \
                            <rect x='0' y='0' width='100%' height='25%' style='{1}'></rect> \
                            <rect x='0' y='25%' width='25%' height='50%' style='{1}'></rect> \
                            <rect x='75%' y='25%' width='25%' height='50%' style='{1}'></rect> \
                            <rect x='0' y='75%' width='100%' height='25%' style='{1}'></rect> \
                            <line x1='25%' y1='25%' x2='25%' y2='30%' style='{2}'></line> \
                            <line x1='25%' y1='25%' x2='30%' y2='25%' style='{2}'></line> \
                            <line x1='75%' y1='25%' x2='75%' y2='30%' style='{2}'></line> \
                            <line x1='75%' y1='25%' x2='70%' y2='25%' style='{2}'></line> \
                            <line x1='25%' y1='75%' x2='25%' y2='70%' style='{2}'></line> \
                            <line x1='25%' y1='75%' x2='30%' y2='75%' style='{2}'></line> \
                            <line x1='75%' y1='75%' x2='75%' y2='70%' style='{2}'></line> \
                            <line x1='75%' y1='75%' x2='70%' y2='75%' style='{2}'></line> \
                            <line x1='27%' y1='25%' x2='73%' y2='25%' style='{3}'> \
                                <animate attributeName='y1' from='25%' to='75%' dur='3s' repeatCount='indefinite' /> \
                                <animate attributeName='y2' from='25%' to='75%' dur='3s' repeatCount='indefinite' /> \
                            </line> \
                        </svg>"
                        , svgCss, rectCss, lineCss, animateLineCss)
                    );
                }
                /** 复位 */
                reset(): void {
                    if (!ibas.objects.isNull(this.codeReader)) {
                        this.codeReader.reset();
                    }
                    let viewContent: sap.ui.core.Element = sap.ui.getCore().byId(this.id);
                    if (!ibas.objects.isNull(viewContent)) {
                        viewContent.destroy(true);
                    }
                }
            }
        }
    }
}