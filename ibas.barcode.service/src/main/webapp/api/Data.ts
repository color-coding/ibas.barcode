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
    export namespace app {
        /** 条码类型 */
        export enum emBarCodeType {
            /** 条码 */
            BAR_CODE,
            /** 二维码 */
            QR_CODE
        }
        /** 调用监听者 */
        export interface IMethodCaller<T> {
            /** 调用者，若设置值，则为onCompleted方法的this */
            caller?: any;
            /**
             * 调用完成
             * @param opRslt 结果
             */
            onCompleted(opRslt: T): void;
        }
        /** 条码/二维码扫描方式 */
        export abstract class ScanMethod extends ibas.Element {
            /** 启用 */
            enabled: boolean;
            /** 扫描 */
            abstract scan(caller: IMethodCaller<string>): void;
        }
        /** 条码/二维码扫描契约 */
        export interface IBarCodeScannerContract extends ibas.IServiceContract {
        }
        /** 条码/二维码扫描服务代理 */
        export class BarCodeScannerServiceProxy extends ibas.ServiceProxy<IBarCodeScannerContract> {

        }
    }
}