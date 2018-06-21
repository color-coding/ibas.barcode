/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace barcode {
    export namespace app {
        /** 条码扫描-APP */
        export class ScanMethodApp extends ScanMethod {
            constructor() {
                super();
                this.enabled = this.validate();
            }
            private validate(): boolean {
                let userAgent: string = navigator.userAgent.toLowerCase();
                if (userAgent.indexOf("x5app") >= 0 || userAgent.indexOf("crosswalk") >= 0) {
                    return true;
                }
                return false;
            }
            scan(caller: IMethodCaller<IScanResult>): void {
                let that: this = this;
                // 负责接收App扫描条码后的结果
                let message: EventListener = function (e: MessageEvent): void {
                    if (!e.origin.startsWith("http://localhost")) {
                        return;
                    }
                    let data: any = e.data["app.barcodeScanner"];
                    if (ibas.objects.isNull(data)) {
                        return;
                    }
                    caller.onCompleted({
                        cancelled: !!!data.cancelled,
                        text: data.text
                    });
                    // 移除对App发送消息的监听
                    window.removeEventListener("message", message);
                };
                // 监听App发送的消息
                window.addEventListener("message", message);
                // 向App发送信息,请求调用条码扫描功能
                window.parent.postMessage("app.barcodeScanner", "*");
            }
        }
    }
}