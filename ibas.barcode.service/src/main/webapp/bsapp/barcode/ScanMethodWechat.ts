/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace barcode {
    export namespace app {
        /** 条码扫描-微信 */
        export class ScanMethodWechat extends ScanMethod {
            constructor() {
                super();
                this.enabled = this.validate();
            }
            private validate(): boolean {
                let userAgent: string = navigator.userAgent.toLowerCase();
                if (userAgent.indexOf("micromessenger") >= 0) {
                    return true;
                }
                return false;
            }
            scan(caller: IMethodCaller<string>): void {
                caller.onCompleted("unrealized method");
            }
        }
    }
}