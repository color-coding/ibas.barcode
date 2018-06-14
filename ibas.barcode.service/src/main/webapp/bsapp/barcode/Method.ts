/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace barcode {
    export namespace app {
        /** 扫描方法 */
        export function scanMethods(): ibas.IList<ScanMethod> {
            let methods: ibas.IList<ScanMethod> = new ibas.ArrayList<ScanMethod>();
            for (let module of shell.app.consoleManager.modules()) {
                for (let element of module.elements()) {
                    if (!(ibas.objects.instanceOf(element, ScanMethod))) {
                        continue;
                    }
                    methods.add(<ScanMethod>element);
                }
            }
            return methods;
        }
    }
}
