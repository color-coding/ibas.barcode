/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace barcode {
    export namespace ui {
        export namespace m {
            /**
             * 视图-条码扫描
             */
            export class BarCodeCreatorView extends ibas.View implements app.IBarCodeCreatorView {
                protected masterPage: sap.m.Page;
                protected detailsPage: sap.m.Page;
                private form: sap.ui.layout.form.SimpleForm;
                private image: sap.m.Image;
                private layoutData: sap.ui.layout.SplitterLayoutData;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.form = new sap.ui.layout.form.SimpleForm("", {
                        editable: true, // 编辑模式影响行高
                        content: [
                            new sap.m.Toolbar("", {
                                content: [
                                    new sap.m.Label("", {
                                        design: sap.m.LabelDesign.Bold,
                                        text: ibas.i18n.prop("barcode_label_setting"),
                                    }),
                                    new sap.m.ToolbarSpacer(""),
                                    new sap.m.Button("", {
                                        type: sap.m.ButtonType.Transparent,
                                        icon: "sap-icon://navigation-right-arrow",
                                        press: function (): void {
                                            that.layoutData.setSize("0%");
                                        }
                                    }),
                                ]
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("barcode_param_codetype") }),
                            new sap.m.Select("", {
                                width: "100%",
                                enabled: true,
                                items: function (): sap.ui.core.ListItem[] {
                                    let map: Map<string, string> = new Map<string, string>();
                                    map.set("1", "BAR_CODE");
                                    map.set("2", "QR_CODE");
                                    // 转换枚举内容
                                    let items: Array<sap.ui.core.ListItem> = new Array<sap.ui.core.ListItem>();
                                    for (let item of map) {
                                        let key: any = item[0];
                                        items.push(new sap.ui.core.ListItem("", {
                                            key: key,
                                            text: ibas.enums.describe(app.emBarCodeType, item[1]),
                                            additionalText: key
                                        }));
                                    }
                                    return items;
                                }(),
                            }).bindProperty("selectedKey", {
                                path: "codeType",
                                type: "sap.ui.model.type.Integer"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("barcode_param_content") }),
                            new sap.m.TextArea("", {
                                placeholder: ibas.i18n.prop("barcode_param_content"),
                                tooltip: ibas.i18n.prop("barcode_param_content"),
                            }).bindProperty("value", {
                                path: "content"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("barcode_param_level") }),
                            new sap.m.Select("", {
                                width: "100%",
                                enabled: true,
                                showSecondaryValues: true,
                                visible: {
                                    path: "codeType",
                                    formatter: function (value: app.emBarCodeType): boolean {
                                        return value === app.emBarCodeType.QR_CODE;
                                    }
                                },
                                items: function (): sap.ui.core.ListItem[] {
                                    let map: Map<string, string> = new Map<string, string>();
                                    map.set("L", "7%");
                                    map.set("M", "15%");
                                    map.set("Q", "20%");
                                    map.set("H", "30%");
                                    // 转换枚举内容
                                    let items: Array<sap.ui.core.ListItem> = new Array<sap.ui.core.ListItem>();
                                    for (let item of map) {
                                        let key: any = item[0];
                                        items.push(new sap.ui.core.ListItem("", {
                                            key: key,
                                            text: key,
                                            additionalText: item[1]
                                        }));
                                    }
                                    return items;
                                }(),
                            }).bindProperty("selectedKey", {
                                path: "level",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("barcode_param_suffix") }),
                            new sap.m.Select("", {
                                width: "100%",
                                enabled: true,
                                items: function (): sap.ui.core.ListItem[] {
                                    let map: Map<string, string> = new Map<string, string>();
                                    map.set("png", "png");
                                    map.set("jpg", "png");
                                    map.set("bmp", "bmp");
                                    // 转换枚举内容
                                    let items: Array<sap.ui.core.ListItem> = new Array<sap.ui.core.ListItem>();
                                    for (let item of map) {
                                        let key: any = item[0];
                                        items.push(new sap.ui.core.ListItem("", {
                                            key: key,
                                            text: key,
                                            additionalText: key
                                        }));
                                    }
                                    return items;
                                }(),
                            }).bindProperty("selectedKey", {
                                path: "suffix",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("barcode_param_margin") }),
                            new sap.m.Select("", {
                                width: "100%",
                                enabled: true,
                                visible: {
                                    path: "codeType",
                                    formatter: function (value: app.emBarCodeType): boolean {
                                        return value === app.emBarCodeType.QR_CODE;
                                    }
                                },
                                items: function (): sap.ui.core.ListItem[] {
                                    let map: Map<string, string> = new Map<string, string>();
                                    map.set("0", "0");
                                    map.set("1", "1");
                                    map.set("2", "2");
                                    map.set("3", "3");
                                    map.set("4", "4");
                                    // 转换枚举内容
                                    let items: Array<sap.ui.core.ListItem> = new Array<sap.ui.core.ListItem>();
                                    for (let item of map) {
                                        let key: any = item[0];
                                        items.push(new sap.ui.core.ListItem("", {
                                            key: key,
                                            text: ibas.enums.describe(app.emBarCodeType, item[1]),
                                            additionalText: key
                                        }));
                                    }
                                    return items;
                                }(),
                            }).bindProperty("selectedKey", {
                                path: "margin",
                                type: "sap.ui.model.type.Integer"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("barcode_param_width") }),
                            new sap.m.Input("", {
                                placeholder: ibas.i18n.prop("barcode_param_width"),
                                tooltip: ibas.i18n.prop("barcode_param_width"),
                                type: sap.m.InputType.Number
                            }).bindProperty("value", {
                                path: "width"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("barcode_param_height") }),
                            new sap.m.Input("", {
                                placeholder: ibas.i18n.prop("barcode_param_height"),
                                tooltip: ibas.i18n.prop("barcode_param_height"),
                                type: sap.m.InputType.Number
                            }).bindProperty("value", {
                                path: "height"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("barcode_param_title") }),
                            new sap.m.Input("", {
                                placeholder: ibas.i18n.prop("barcode_param_title"),
                                tooltip: ibas.i18n.prop("barcode_param_title"),
                            }).bindProperty("value", {
                                path: "title"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("barcode_param_fontsize") }),
                            new sap.m.Input("", {
                                placeholder: ibas.i18n.prop("barcode_param_fontsize"),
                                tooltip: ibas.i18n.prop("barcode_param_fontsize"),
                                type: sap.m.InputType.Number
                            }).bindProperty("value", {
                                path: "fontSize"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("barcode_param_logo") }),
                            new sap.m.Input("", {
                                placeholder: ibas.i18n.prop("barcode_param_logo"),
                                tooltip: ibas.i18n.prop("barcode_param_logo"),
                                visible: {
                                    path: "codeType",
                                    formatter: function (value: app.emBarCodeType): boolean {
                                        return value === app.emBarCodeType.QR_CODE;
                                    }
                                },
                            }).bindProperty("value", {
                                path: "logo"
                            })
                        ]
                    });
                    this.layoutData = new sap.ui.layout.SplitterLayoutData("", {
                        resizable: true,
                        size: "100%"
                    });
                    that.masterPage = new sap.m.Page("", {
                        showHeader: false,
                        content: [
                            this.form
                        ],
                        layoutData: this.layoutData
                    });
                    that.detailsPage = new sap.m.Page("", {
                        showHeader: false,
                        content: [
                            new sap.m.Toolbar("", {
                                content: [
                                    new sap.m.Button("", {
                                        type: sap.m.ButtonType.Transparent,
                                        icon: "sap-icon://navigation-left-arrow",
                                        press: function (): void {
                                            that.layoutData.setSize("100%");
                                        }
                                    }),
                                    new sap.m.ToolbarSpacer(""),
                                    new sap.m.Button("", {
                                        text: ibas.i18n.prop("barcode_btn_copylink"),
                                        type: sap.m.ButtonType.Transparent,
                                        icon: "sap-icon://copy",
                                        press: function (): void {
                                            let param: app.BarCodeCreatorParam = that.param;
                                            if (ibas.objects.isNull(param)) {
                                                return;
                                            }
                                            that.application.viewShower.proceeding(that,
                                                ibas.emMessageType.INFORMATION,
                                                ibas.i18n.prop("barcode_unrealized_method"),
                                            );
                                        }
                                    }),
                                    new sap.m.Button("", {
                                        text: ibas.i18n.prop("barcode_btn_save"),
                                        type: sap.m.ButtonType.Transparent,
                                        icon: "sap-icon://save",
                                        press: function (): void {
                                            let param: app.BarCodeCreatorParam = that.param;
                                            if (ibas.objects.isNull(param)) {
                                                return;
                                            }
                                            let fileName: string = ibas.strings.format("{0}.{1}",
                                                ibas.strings.isEmpty(param.title) ? ibas.uuids.random() : param.title,
                                                param.suffix);
                                            let img: HTMLImageElement = new Image();
                                            // 解决图片跨域问题 https://www.jianshu.com/p/6fe06667b748
                                            img.setAttribute("crossOrigin", "Anonymous");
                                            img.src = param.toString();
                                            img.onload = function (): void {
                                                let canvas: HTMLCanvasElement = document.createElement("canvas");
                                                canvas.width = img.width;
                                                canvas.height = img.height;
                                                let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
                                                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                                canvas.toBlob((data: Blob): void => {
                                                    ibas.files.save(data, fileName);
                                                });
                                            };
                                        }
                                    }),
                                ]
                            }),
                            new sap.m.FlexBox("", {
                                width: "100%",
                                height: "100%",
                                renderType: sap.m.FlexRendertype.Div,
                                justifyContent: sap.m.FlexJustifyContent.Center,
                                alignContent: sap.m.FlexAlignContent.Center,
                                alignItems: sap.m.FlexAlignItems.Center,
                                wrap: sap.m.FlexWrap.Wrap,
                                direction: sap.m.FlexDirection.Column,
                                items: [
                                    that.image = new sap.m.Image("", {
                                        width: "{/width}px",
                                        src: {
                                            path: "/",
                                            formatter(value: any): string {
                                                if (!ibas.objects.isNull(value)) {
                                                    // 加#号是为了把后面的字符串都作为hash处理,避免作为参数传入,引发错误
                                                    // sap.m.Image 会在src后面追加@1.5等字符串
                                                    return ibas.strings.format("{0}#", value.toString());
                                                }
                                            }
                                        }
                                    }),
                                    new sap.m.Link("", {
                                        target: "_blank",
                                        wrapping: true,
                                        textAlign: sap.ui.core.TextAlign.Center,
                                        width: "100%",
                                        text: {
                                            path: "/",
                                            formatter(value: any): string {
                                                if (!ibas.objects.isNull(value)) {
                                                    return value.toString();
                                                }
                                            }
                                        },
                                        href: {
                                            path: "/",
                                            formatter(value: any): string {
                                                if (!ibas.objects.isNull(value)) {
                                                    return value.toString();
                                                }
                                            }
                                        }
                                    })
                                ]
                            }),
                        ],
                        layoutData: new sap.ui.layout.SplitterLayoutData("", {
                            size: "auto"
                        })
                    });
                    let page: sap.m.Page = new sap.m.Page("", {
                        showHeader: false,
                        content: [
                            new sap.ui.layout.Splitter("", {
                                contentAreas: [
                                    this.masterPage,
                                    this.detailsPage
                                ]
                            })
                        ]
                    });
                    that.id = page.getId();
                    return page;
                }
                param: app.BarCodeCreatorParam;
                // 显示参数
                showParam(param: app.BarCodeCreatorParam): void {
                    let that: this = this;
                    this.param = param;
                    let model: sap.ui.model.json.JSONModel = new sap.ui.model.json.JSONModel(param);
                    this.form.setModel(model);
                    this.form.bindObject("/");
                    this.detailsPage.setModel(model);
                    // 监听属性改变，并更新控件
                    openui5.utils.refreshModelChanged(this.form, param);
                    // openui5.utils.refreshModelChanged(this.detailsPage, param);
                    param.registerListener({
                        id: this.detailsPage.getId(),
                        propertyChanged(property: string): void {
                            if (property.toLowerCase() === "level"
                                || property.toLowerCase() === "logo") {
                                if (!ibas.strings.isEmpty(param.logo) && param.level !== "H") {
                                    param.level = "H";
                                    that.application.viewShower.proceeding(that,
                                        ibas.emMessageType.INFORMATION,
                                        ibas.i18n.prop("barcode_msg_level_must_be_h_when_has_logo"),
                                    );
                                }
                            }
                            let model: sap.ui.model.Model = that.detailsPage.getModel(undefined);
                            if (!ibas.objects.isNull(model)) {
                                model.refresh(true);
                            }
                        }
                    });
                }
            }
        }
    }
}
