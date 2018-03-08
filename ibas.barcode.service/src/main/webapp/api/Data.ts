/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace barcode {
    /** 模块-标识 */
    export const CONSOLE_ID: string = "41218cef-18b4-4399-ab3c-7ba37bf34b5c";
    /** 模块-名称 */
    export const CONSOLE_NAME: string = "BarCode";
    /** 模块-版本 */
    export const CONSOLE_VERSION: string = "0.1.0";
    /** 业务仓库名称 */
    export const BO_REPOSITORY_BARCODE: string = ibas.strings.format(ibas.MODULE_REPOSITORY_NAME_TEMPLATE, CONSOLE_NAME);
    export namespace bo {
    }
}