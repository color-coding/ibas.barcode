/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace barcode {
    export namespace app {
        /** 条码/二维码扫描服务 */
        export class BarCodeScannerService extends ibas.ServiceWithResultApplication<IBarCodeScannerView, IBarCodeScannerContract, IScanResult> {
            /** 应用标识 */
            static APPLICATION_ID: string = "21f27f92-416e-4127-b9f5-005e8dd4110d";
            /** 应用名称 */
            static APPLICATION_NAME: string = "barcode_service_barcodescanner";
            /** 构造函数 */
            constructor() {
                super();
                this.id = BarCodeScannerService.APPLICATION_ID;
                this.name = BarCodeScannerService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 运行服务 */
            runService(contract: IBarCodeScannerContract): void {

            }
            /** 完成 */
            private onCompleted: Function;
            run(...args: any[]): void {
                let that: this = this;
                if (!ibas.objects.isNull(args) && args.length === 1) {
                    // 判断是否为选择契约
                    if (!!args[0].onCompleted) {
                        this.onCompleted = args[0].onCompleted;
                    }
                    if (!!args[0].proxy) {
                        let contract: IBarCodeScannerContract = args[0].proxy.contract;
                        // 是否格式化扫码结果
                        this.needFormat = contract.needFormat === true;
                        let methods: ibas.IList<ScanMethod> = scanMethods();
                        let method: ScanMethod = methods.firstOrDefault(c => c.enabled);
                        if (!ibas.objects.isNull(method)) {
                            method.scan({
                                onCompleted(result: IScanResult): void {
                                    that.fireCompleted(result);
                                }
                            });
                        } else {
                            if (ibas.objects.isNull(contract.scanType)) {
                                this.scanType = emBarCodeType.ALL;
                            } else {
                                this.scanType = contract.scanType;
                            }
                            if (ibas.objects.isNull(contract.continuousScan)) {
                                this.continuousScan = false;
                            } else {
                                this.continuousScan = contract.continuousScan;
                            }
                            if (ibas.objects.isNull(contract.enableLocalFile)) {
                                // 默认可以从本地上传图片
                                this.enableLocalFile = true;
                            } else {
                                this.enableLocalFile = contract.enableLocalFile;
                            }
                            this.show();
                        }
                    }
                }
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                if (!ibas.objects.isNull(this.scanType) && this.scanType !== emBarCodeType.ALL) {
                    this.view.title = ibas.strings.format("{0}({1})", this.view.title,
                        ibas.i18n.prop("barcode_support_scan_type", ibas.enums.describe(emBarCodeType, this.scanType))
                    );
                }
                // 其他事件
                this.view.enableLocalFile = this.enableLocalFile;
                this.view.scanEvent = this.scan;
            }
            /** 扫码类型 */
            private scanType: emBarCodeType;
            /** 是否格式化扫码结果 */
            private needFormat: boolean;
            /** 是否可以从本地选择图片 */
            private enableLocalFile: boolean;
            /** 是否连续扫描 */
            private continuousScan: boolean;
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                if (document.location.protocol !== "https:" && document.location.hostname !== "localhost") {
                    // 未启用https协议,不能使用摄像头
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("barcode_not_use_https_protocol"));
                } else {
                    this.view.showScanner(this.scanType);
                }
            }
            /** 关闭视图 */
            close(): void {
                this.view.reset();
                super.close();
            }
            private scan(result: IScanResult): void {
                this.fireCompleted(result);
            }
            /** 触发完成事件 */
            protected fireCompleted(result: IScanResult): void {
                let that: this = this;
                if (!result.cancelled) {
                    // 记录扫码结果
                    if (ibas.objects.isNull(result.error)) {
                        if (that.viewShower instanceof shell.app.CenterApp) {
                            that.proceeding(
                                ibas.emMessageType.INFORMATION, "scan code:" + result.text);
                        }
                        ibas.logger.log(ibas.emMessageLevel.INFO, "scan code:" + result.text);
                    } else {
                        if (that.viewShower instanceof shell.app.CenterApp) {
                            that.proceeding(
                                ibas.emMessageType.ERROR, "scan code Error:" + result.error.message);
                        }
                        ibas.logger.log(ibas.emMessageLevel.ERROR, "scan code Error:" + result.error.message);
                    }
                }
                // 不需要格式化扫码结果,直接返回
                if (!this.needFormat || result.cancelled || !!result.error) {
                    // 如果不是连续扫描或点击的是退出
                    if (!this.continuousScan || result.cancelled) {
                        this.close();
                    }
                    if (!ibas.objects.isNull(this.onCompleted)) {
                        result.continueScan = function (message: string): void {
                            that.view.showScanMessage(message);
                        };
                        this.onCompleted(result);
                    }
                } else {
                    let formatResult: IScanFormatResult = result;
                    let boRepository: integration.bo.IBORepositoryIntegration =
                        ibas.boFactory.create<integration.bo.IBORepositoryIntegration>(integration.bo.BO_REPOSITORY_INTEGRATION);
                    // 用户可能没有集成模块的权限,直接报错返回
                    if (!ibas.objects.isNull(boRepository)) {
                        let fireCompleted: Function = super.fireCompleted;
                        // 查询任务
                        let criteria: ibas.ICriteria = new ibas.Criteria();
                        let condition: ibas.ICondition = criteria.conditions.create();
                        condition.alias = integration.bo.CRITERIA_CONDITION_ALIAS_BOCODE;
                        condition.value = ibas.config.applyVariables(bo.BO_CODE_SCANRESULT);
                        condition = criteria.conditions.create();
                        condition.alias = integration.bo.CRITERIA_CONDITION_ALIAS_ACTIVATED;
                        condition.value = ibas.emYesNo.YES.toString();
                        boRepository.fetchIntegrationJob({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<integration.bo.IIntegrationJob>): void {
                                try {
                                    if (opRslt.resultCode !== 0) {
                                        throw new Error(opRslt.message);
                                    }
                                    let job: integration.bo.IIntegrationJob = opRslt.resultObjects.firstOrDefault();
                                    if (ibas.objects.isNull(job)) {
                                        throw new Error(ibas.i18n.prop("barcode_not_found_integrationjob"));
                                    }
                                    that.runIntegrationJob(job, formatResult);
                                } catch (error) {
                                    formatResult.formatError = error;
                                    fireCompleted.call(that, formatResult);
                                }
                            }
                        });
                    } else {
                        formatResult.formatError = new Error(ibas.i18n.prop("barcode_not_have_privilege_for_integration_module"));
                        // 如果不是连续扫描或点击的是退出
                        if (!this.continuousScan || result.cancelled) {
                            this.close();
                        }
                        if (!ibas.objects.isNull(this.onCompleted)) {
                            this.onCompleted(result);
                        }
                    }
                }
            }
            /** 运行集成任务-集成任务配置扫码结果格式化规则 */
            protected runIntegrationJob(job: integration.bo.IIntegrationJob, formatResult: IScanFormatResult): void {
                if (job.integrationJobActions.length > 0) {
                    let that: this = this;
                    let fireCompleted: Function = super.fireCompleted;
                    let boRepository: integration.bo.IBORepositoryIntegration =
                        ibas.boFactory.create<integration.bo.IBORepositoryIntegration>(integration.bo.BO_REPOSITORY_INTEGRATION);
                    boRepository.fetchAction({
                        criteria: job,
                        onCompleted(opRslt: ibas.IOperationResult<integration.bo.IAction>): void {
                            try {
                                if (opRslt.resultCode !== 0) {
                                    throw new Error(opRslt.message);
                                }
                                if (opRslt.resultObjects.length === 0) {
                                    throw new Error(ibas.i18n.prop("barcode_not_found_job_actions", job.name));
                                }
                                let runActions: Function = function (i: number, extraData: IScanFormatResult): void {
                                    if (i < opRslt.resultObjects.length) {
                                        that.runAction(opRslt.resultObjects[i], extraData)
                                            .then((actionResult: IScanFormatResult) => {
                                                if (!ibas.objects.isNull(actionResult.formattedText)
                                                    || !ibas.objects.isNull(actionResult.formatError)) {
                                                    fireCompleted.call(that, actionResult);
                                                } else {
                                                    runActions(++i);
                                                }
                                            });
                                    } else {
                                        fireCompleted.call(that, formatResult);
                                    }
                                };
                                runActions(0, formatResult);
                            } catch (error) {
                                formatResult.formatError = error;
                                fireCompleted.call(that, formatResult);
                            }
                        }
                    });
                } else {
                    formatResult.formatError = new Error(ibas.i18n.prop("barcode_not_found_job_actions", job.name));
                    super.fireCompleted(formatResult);
                }
            }
            /** 运行集成动作-该集成动作代表特定的一种扫码结果格式化规则 */
            protected async runAction(usingAction: integration.bo.IAction, extraData: IScanFormatResult): Promise<IScanFormatResult> {
                let that: this = this;
                let promise: Promise<IScanFormatResult> = new Promise<IScanFormatResult>(resolve => {
                    try {
                        if (ibas.objects.isNull(usingAction)) {
                            return;
                        }
                        let baseUrl: string = usingAction.group;
                        if (ibas.strings.isEmpty(baseUrl)) {
                            baseUrl = ibas.urls.normalize(ibas.urls.ROOT_URL_SIGN);
                        }
                        if (!baseUrl.toLowerCase().startsWith("http")) {
                            baseUrl = ibas.urls.normalize(ibas.urls.ROOT_URL_SIGN) + baseUrl;
                        }
                        let token: string = ibas.config.get(ibas.CONFIG_ITEM_USER_TOKEN, "");
                        let rtVersion: string = ibas.dates.now().getTime().toString();
                        let actionRequire: Require = ibas.requires.create({
                            baseUrl: baseUrl,
                            context: usingAction.name.trim(),
                            waitSeconds: ibas.config.get(ibas.requires.CONFIG_ITEM_WAIT_SECONDS, 30),
                            urlArgs: function (id: string, url: string): string {
                                if (id.indexOf("ibas/") >= 0 || id.startsWith("_@") || id === "require" || id === "exports") {
                                    return "";
                                }
                                // 允许多次调用
                                return (url.indexOf("?") === -1 ? "?" : "&") + "token=" + ibas.tokens.content(token) + "&_=" + rtVersion;
                            }
                        });
                        let path: string = usingAction.path;
                        if (ibas.strings.isEmpty(path)) {
                            path = usingAction.name.trim();
                        }
                        if (path.indexOf(".") > 0) {
                            path = path.substring(0, path.lastIndexOf("."));
                        }
                        actionRequire(
                            [path],
                            function (library: any): void {
                                // 库加载成功
                                try {
                                    if (ibas.objects.isNull(library)) {
                                        throw new Error("invalid action library.");
                                    }
                                    if (ibas.objects.isNull(library.default) && !ibas.objects.isAssignableFrom(library.default, ibas.Action)) {
                                        throw new Error("invalid action class.");
                                    }
                                    let action: ibas.Action = new library.default();
                                    if (!(ibas.objects.instanceOf(action, ibas.Action))) {
                                        throw new Error("invalid action instance.");
                                    }
                                    // 输入设置
                                    for (let item of usingAction.configs) {
                                        if (ibas.objects.isNull(item.value) || ibas.objects.isNull(item.key)) {
                                            continue;
                                        }
                                        action.addConfig(item.key, ibas.config.applyVariables(item.value));
                                    }
                                    // 日志输出视图
                                    action.setLogger({
                                        level: ibas.config.get(ibas.CONFIG_ITEM_MESSAGES_LEVEL, ibas.emMessageLevel.INFO, ibas.emMessageLevel),
                                        log(): void {
                                            let tmpArgs: Array<any> = new Array();
                                            for (let item of arguments) {
                                                tmpArgs.push(item);
                                            }
                                            ibas.logger.log.apply(ibas.logger, tmpArgs);
                                            let message: string;
                                            let type: ibas.emMessageType = ibas.emMessageType.INFORMATION;
                                            if (typeof (tmpArgs[0]) === "number" && tmpArgs.length > 1) {
                                                type = that.toMessageType(tmpArgs[0]);
                                                message = ibas.strings.format(tmpArgs[1], tmpArgs.slice(2));
                                            } else if (typeof (tmpArgs[0]) === "string") {
                                                message = ibas.strings.format(tmpArgs[0], tmpArgs.slice(1));
                                            }
                                            that.proceeding(type, message);
                                        }
                                    });
                                    // 添加额外运行数据
                                    action.extraData = extraData;
                                    // 运行
                                    action.do();
                                } catch (error) {
                                    extraData.formatError = error;
                                }
                                resolve(extraData);
                            },
                            function (): void {
                                // 库加载失败
                                extraData.formatError = new Error(ibas.i18n.prop("integrationdevelopment_run_action_faild", usingAction.name));
                                resolve(extraData);
                            }
                        );
                    } catch (error) {
                        extraData.formatError = error;
                        resolve(extraData);
                    }
                });
                return promise;
            }
            private toMessageType(level: ibas.emMessageLevel): ibas.emMessageType {
                let type: ibas.emMessageType = ibas.emMessageType.INFORMATION;
                if (level === ibas.emMessageLevel.WARN) {
                    type = ibas.emMessageType.WARNING;
                } else if (level === ibas.emMessageLevel.ERROR) {
                    type = ibas.emMessageType.ERROR;
                } else if (level === ibas.emMessageLevel.FATAL) {
                    type = ibas.emMessageType.ERROR;
                }
                return type;
            }
        }
        /** 视图-条码扫描 */
        export interface IBarCodeScannerView extends ibas.IResidentView {
            /** 是否可以从本地选择图片 */
            enableLocalFile: boolean;
            // 扫描
            scanEvent: Function;
            // 显示屏幕
            showScanner(type: emBarCodeType): void;
            // 复位
            reset(): void;
            // 继续扫描
            showScanMessage(message: string): void;
        }
        /** 条码/二维码扫描服务 */
        export class BarCodeScannerServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = BarCodeScannerService.APPLICATION_ID;
                this.name = BarCodeScannerService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
                this.proxy = BarCodeScannerServiceProxy;
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new BarCodeScannerService();
            }
        }
    }
}