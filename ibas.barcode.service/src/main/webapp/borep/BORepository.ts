/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace barcode {
    export namespace bo {

        /** 业务对象仓库 */
        export class BORepositoryBarCode extends ibas.BORepositoryApplication implements IBORepositoryBarCode {

            /** 创建此模块的后端与前端数据的转换者 */
            protected createConverter(): ibas.IDataConverter {
                return new DataConverter;
            }
            /**
             * 上传文件
             * @param caller 调用者
             */
            upload(caller: ibas.IUploadFileCaller<ibas.FileData>): void {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let fileRepository: ibas.FileRepositoryUploadAjax = new ibas.FileRepositoryUploadAjax();
                fileRepository.address = this.address.replace("/services/rest/data/", "/services/rest/file/");
                fileRepository.token = this.token;
                fileRepository.converter = this.createConverter();
                fileRepository.upload("upload", caller);
            }
            /**
             * 下载文件
             * @param caller 调用者
             */
            download(caller: ibas.IDownloadFileCaller<Blob>): void {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let fileRepository: ibas.FileRepositoryDownloadAjax = new ibas.FileRepositoryDownloadAjax();
                fileRepository.address = this.address.replace("/services/rest/data/", "/services/rest/file/");
                fileRepository.token = this.token;
                fileRepository.converter = this.createConverter();
                fileRepository.download("download", caller);
            }
            /**
             * 查询 微信签名
             * @param fetcher 查询者
             */
            fetchWechatSignature(fetcher: IWechatSignatureMethodCaller<string>): void {
                let boRepository: ibas.BORepositoryAjax = new ibas.BORepositoryAjax();
                boRepository.address = this.address;
                boRepository.token = this.token;
                boRepository.converter = this.createConverter();
                let url: string = fetcher.url;
                if (ibas.strings.isEmpty(url)) {
                    // 去除哈希
                    url = ibas.strings.format("{0}{1}{2}", window.location.origin,
                        window.location.pathname, window.location.search);
                }
                url = encodeURIComponent(url);
                let method: string =
                    ibas.strings.format("fetchWechatSignature?app={0}&url={1}&token={2}",
                        fetcher.app, url, this.token);
                boRepository.callRemoteMethod(method, undefined, fetcher);
            }
        }
    }
}