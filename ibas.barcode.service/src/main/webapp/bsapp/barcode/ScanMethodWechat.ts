/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace barcode {
    /** 配置项目-微信公众平台应用编码 */
    export const CONFIG_ITEM_WECHAT_MP_APP_CODE: string = "wechatMPApp";
    export const BARCODE_SCAN_WECHAT: string = "BS_WECHAT";
    export namespace app {
        /** 条码扫描-微信 */
        export class ScanMethodWechat extends ScanMethod {
            constructor() {
                super();
                this.id = "5fc1462c-f7b4-4422-a191-a709e0d2633a";
                this.name = BARCODE_SCAN_WECHAT;
                this.description = ibas.i18n.prop(this.name.toLowerCase());
                this.enabled = this.validate();
            }
            private validate(): boolean {
                let userAgent: string = navigator.userAgent.toLowerCase();
                if (userAgent.indexOf("micromessenger") >= 0) {
                    return true;
                }
                return false;
            }
            scan(caller: IMethodCaller<IScanResult>): void {
                let app: string = ibas.config.get(CONFIG_ITEM_WECHAT_MP_APP_CODE, "TX-WX-01");
                let boRepository: bo.BORepositoryBarCode = new bo.BORepositoryBarCode();
                boRepository.fetchWechatSignature({
                    app: app,
                    onCompleted(opRslt: ibas.IOperationResult<string>): void {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let json: string = opRslt.resultObjects.firstOrDefault();
                            if (ibas.strings.isEmpty(json)) {
                                throw new Error(ibas.i18n.prop(""));
                            } else {
                                let config: any = JSON.parse(json);
                                // 使用此模块库加载器
                                let require: Require = ibas.requires.create({
                                    context: ibas.requires.naming(CONSOLE_NAME),
                                });
                                require(["https://res.wx.qq.com/open/js/jweixin-1.3.0.js",],
                                    function (wx: any): void {
                                        wx.ready(function (): void {
                                            wx.scanQRCode({
                                                needResult: 1,
                                                desc: "scanQRCode desc",
                                                success: function (res: any): void {
                                                    caller.onCompleted({
                                                        cancelled: false,
                                                        text: res.resultStr
                                                    });
                                                },
                                                cancel: function (res: any): void {
                                                    caller.onCompleted({
                                                        cancelled: true,
                                                        text: undefined
                                                    });
                                                }
                                            });
                                        });
                                        wx.error(function (res: any): void {
                                            caller.onCompleted({
                                                cancelled: false,
                                                text: undefined,
                                                error: new Error(res.errMsg)
                                            });
                                        });
                                        wx.config({
                                            debug: false,
                                            appId: config.appId,
                                            timestamp: config.timestamp,
                                            nonceStr: config.nonceStr,
                                            signature: config.signature,
                                            jsApiList: [
                                                "scanQRCode"
                                            ]
                                        });
                                    }
                                );
                            }
                        } catch (error) {
                            caller.onCompleted({
                                cancelled: false,
                                text: undefined,
                                error: error
                            });
                        }
                    }
                });

            }
        }
    }
}