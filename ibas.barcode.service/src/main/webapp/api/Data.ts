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

    export namespace config {
        /**
         * 获取此模块配置
         * @param key 配置项
         * @param defalut 默认值
         */
        export function get<T>(key: string, defalut?: T): T {
            return ibas.config.get(ibas.strings.format("{0}|{1}", CONSOLE_ID, key), defalut);
        }
    }
    export namespace bo {
        /** 业务仓库名称 */
        export const BO_REPOSITORY_BARCODE: string = ibas.strings.format(ibas.MODULE_REPOSITORY_NAME_TEMPLATE, CONSOLE_NAME);
        /** 业务对象编码-扫码结果 */
        export const BO_CODE_SCANRESULT: string = "${Company}_BC_SCANRESULT";
    }
    export namespace app {
        /** 条码类型 */
        export enum emBarCodeType {
            /** 所有 */
            ALL,
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
             * @param result 结果
             */
            onCompleted(result: T): void;
        }
        /** 扫描结果 */
        export interface IScanResult {
            /** 用户主动取消扫描 */
            cancelled: boolean;
            /** 扫描结果 */
            text: string;
            /** 错误 */
            error?: Error;
        }
        /** 扫描结果-结果已格式化 */
        export interface IScanFormatResult extends IScanResult {
            /** 格式化后的文本 */
            formattedText?: string;
            /** 格式化时出现的错误 */
            formatError?: Error;
        }
        /** 条码/二维码扫描方式 */
        export abstract class ScanMethod extends ibas.Element {
            /** 启用 */
            enabled: boolean;
            /** 扫描 */
            abstract scan(caller: IMethodCaller<IScanResult>): void;
        }
        /** 条码/二维码扫描契约 */
        export interface IBarCodeScannerContract extends ibas.IServiceContract {
            /** 扫码类型 默认为all */
            scanType?: emBarCodeType;
            /** 是否格式化扫码结果 默认为true */
            needFormat?: boolean;
            /** 是否可以从本地选择图片 默认为true */
            enableLocalFile?: boolean;
            /** 是否连续扫描 默认为false */
            continuousScan?: boolean;
        }
        /** 条码/二维码扫描服务代理 */
        export class BarCodeScannerServiceProxy extends ibas.ServiceProxy<IBarCodeScannerContract> {

        }
    }
}