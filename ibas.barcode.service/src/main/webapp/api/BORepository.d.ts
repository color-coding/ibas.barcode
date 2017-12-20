/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import {
    FetchCaller,
    SaveCaller,
    UploadFileCaller,
    DownloadFileCaller,
    FileData,
    IBORepositoryApplication,
} from "ibas/index";
// import * as bo from "./bo/index"

/** 业务仓库 */
export interface IBORepositoryBarCode extends IBORepositoryApplication {

    /**
     * 上传文件
     * @param caller 调用者
     */
    upload(caller: UploadFileCaller<FileData>);
    /**
     * 下载文件
     * @param caller 调用者
     */
    download(caller: DownloadFileCaller<Blob>);

}
