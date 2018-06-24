/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace barcode {
    export namespace bo {
        /**
         * 微信签名相关调用者
         */
        export interface IWechatSignatureMethodCaller<P> extends ibas.IMethodCaller<P> {
            /** 应用编码 */
            app: string;
            /** 当前页面地址 */
            url?: string;
            /**
             * 调用完成
             * @param opRslt 结果
             */
            onCompleted(opRslt: ibas.IOperationResult<P>): void;
        }

        /** 业务仓库 */
        export interface IBORepositoryBarCode extends ibas.IBORepositoryApplication {
            /**
             * 上传文件
             * @param caller 调用者
             */
            upload(caller: ibas.IUploadFileCaller<ibas.FileData>): void;
            /**
             * 下载文件
             * @param caller 调用者
             */
            download(caller: ibas.IDownloadFileCaller<Blob>): void;
            /**
             * 查询 微信签名
             * @param fetcher 查询者
             */
            fetchWechatSignature(fetcher: IWechatSignatureMethodCaller<string>): void;
        }
    }
}