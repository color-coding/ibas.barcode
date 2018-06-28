/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../../c/barcode/index.ts" />
namespace barcode {
    export namespace ui {
        export namespace m {
            /**
             * 视图-条码扫描
             */
            export class BarCodeScannerView extends c.BarCodeScannerView {

                /** 修饰/美化界面 */
                prettify(): void {
                    $("#video").css({
                        width: "100%",
                        height: ibas.strings.format("calc({0}px - 2rem)", $("#bar_code_scanner").parent().parent().parent().height()),
                        "object-fit": "none",
                        "object-position": "center",
                    });
                    let height: number = $("#video").height() / 4;
                    let svgCss: string = "position:absolute;top:0;left:0;bottom:0;right:0;";
                    let rectCss: string = "fill:black;fill-opacity:0.6;";
                    let lineCss: string = "stroke:#30e630;stroke-width:3;";
                    let animateLineCss: string = "stroke:#30e630;stroke-width:2;fill-opacity:0.6;";
                    $("#bar_code_scanner").append(ibas.strings.format(
                        "<svg width='100%' height='100%' version='1.1' xmlns='http://www.w3.org/2000/svg' style='{0}'> \
                            <rect x='0' y='0' width='100%' height='25%' style='{1}'></rect> \
                            <rect x='0' y='25%' width='calc(50% - {4}px)' height='50%' style='{1}'></rect> \
                            <rect x='calc(50% + {4}px)' y='25%' width='calc(50% - {4}px)' height='50%' style='{1}'></rect> \
                            <rect x='0' y='75%' width='100%' height='25%' style='{1}'></rect> \
                            <line x1='calc(50% - {4}px)' y1='25%' x2='calc(50% - {4}px)' y2='30%' style='{2}'></line> \
                            <line x1='calc(50% - {4}px)' y1='25%' x2='calc(55% - {4}px)' y2='25%' style='{2}'></line> \
                            <line x1='calc(50% + {4}px)' y1='25%' x2='calc(50% + {4}px)' y2='30%' style='{2}'></line> \
                            <line x1='calc(50% + {4}px)' y1='25%' x2='calc(45% + {4}px)' y2='25%' style='{2}'></line> \
                            <line x1='calc(50% - {4}px)' y1='75%' x2='calc(50% - {4}px)' y2='70%' style='{2}'></line> \
                            <line x1='calc(50% - {4}px)' y1='75%' x2='calc(55% - {4}px)' y2='75%' style='{2}'></line> \
                            <line x1='calc(50% + {4}px)' y1='75%' x2='calc(50% + {4}px)' y2='70%' style='{2}'></line> \
                            <line x1='calc(50% + {4}px)' y1='75%' x2='calc(45% + {4}px)' y2='75%' style='{2}'></line> \
                            <line x1='calc(52% - {4}px)' y1='25%' x2='calc(48% + {4}px)' y2='25%' style='{3}'> \
                                <animate attributeName='y1' from='25%' to='75%' dur='3s' repeatCount='indefinite' /> \
                                <animate attributeName='y2' from='25%' to='75%' dur='3s' repeatCount='indefinite' /> \
                            </line> \
                        </svg>"
                        , svgCss, rectCss, lineCss, animateLineCss, height)
                    );
                }
            }
        }
    }
}