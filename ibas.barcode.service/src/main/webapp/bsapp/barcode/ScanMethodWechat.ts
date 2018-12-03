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
    /** 配置项目-微信小程序应用编码 */
    export const CONFIG_ITEM_WECHAT_MINI_PROGRAM_APP_CODE: string = "wechatMiniProgramApp";
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
            /*** ios平台下,微信内置浏览器,仅使用userToken登录时,需要补全url */
            private needFixUrl: boolean;
            /*** 是否是微信小程序 */
            private isMiniProgram: boolean;
            private validate(): boolean {
                let userAgent: string = window.navigator.userAgent.toLowerCase();
                if (userAgent.indexOf("iphone") >= 0
                    || userAgent.indexOf("ipad") >= 0) {
                    // ios平台下
                    if (ibas.config.get(shell.bo.CONFIG_ITEM_CONNECTION_WAY, "")
                        === shell.bo.CONNECTION_WAY_USER_TOKEN) {
                        // 使用userToken登录时,需要补全url
                        this.needFixUrl = true;
                    }
                }
                if (userAgent.indexOf("miniprogram") >= 0
                    // ios不能通过UA判断浏览器类型
                    || (<any>window).__wxjs_environment === "miniprogram") {
                    this.isMiniProgram = true;
                }
                if (userAgent.indexOf("micromessenger") >= 0) {
                    return true;
                }
                return false;
            }
            scan(caller: IMethodCaller<IScanResult>): void {
                let app: string = ibas.config.get(CONFIG_ITEM_WECHAT_MP_APP_CODE, "TX-WX-01");
                if (!!this.isMiniProgram) {
                    app = ibas.config.get(CONFIG_ITEM_WECHAT_MINI_PROGRAM_APP_CODE, "TX-WX-03");
                }
                let boRepository: bo.BORepositoryBarCode = new bo.BORepositoryBarCode();
                boRepository.fetchWechatSignature({
                    app: app,
                    // 微信内置浏览器在IOS上的一些问题,https://www.aliyun.com/jiaocheng/376814.html
                    url: this.needFixUrl ? ibas.strings.format("{0}{1}?{2}={3}", window.location.origin,
                        window.location.pathname, ibas.CONFIG_ITEM_USER_TOKEN, ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_TOKEN)) : "",
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
                                                },
                                                fail: function (res: any): void {
                                                    caller.onCompleted({
                                                        cancelled: false,
                                                        text: undefined,
                                                        error: new Error(res.errMsg)
                                                    });
                                                },
                                            });
                                        });
                                        wx.error(function (res: any): void {
                                            caller.onCompleted({
                                                cancelled: false,
                                                text: undefined,
                                                error: new Error(res.errMsg)
                                            });
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