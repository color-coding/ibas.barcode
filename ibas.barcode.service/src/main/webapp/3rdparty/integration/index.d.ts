/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    /** 模块-标识 */
    const CONSOLE_ID: string;
    /** 模块-名称 */
    const CONSOLE_NAME: string;
    /** 模块-版本 */
    const CONSOLE_VERSION: string;
    namespace bo {
        /** 业务仓库名称 */
        const BO_REPOSITORY_INTEGRATION: string;
        /** 业务对象编码-集成任务 */
        const BO_CODE_INTEGRATIONJOB: string;
        /**
         * 动作关系
         */
        enum emActionRelationship {
            /**
             * 与(&&)
             */
            AND = 0,
            /**
             * 或(||)
             */
            OR = 1
        }
        /** 查询任务条件-服务的名称 */
        const CRITERIA_CONDITION_ALIAS_JOB_NAME: string;
        /** 查询任务条件-关联的业务对象 */
        const CRITERIA_CONDITION_ALIAS_BOCODE: string;
        /** 查询任务条件-关联的应用 */
        const CRITERIA_CONDITION_ALIAS_APPLICATION_ID: string;
        /** 查询任务条件-是否激活 */
        const CRITERIA_CONDITION_ALIAS_ACTIVATED: string;
        /** 查询动作条件-ID */
        const CRITERIA_CONDITION_ALIAS_ACTION_ID: string;
        /** 查询动作条件-包（组） */
        const CRITERIA_CONDITION_ALIAS_PACKAGE: string;
    }
    namespace app {
        /** 集成任务服务契约 */
        interface IIntegrationJobServiceContract {
            /** 任务名称 */
            jobName: string | bo.IIntegrationJob;
            /** 是否自动运行 */
            autoRun?: boolean;
            /** 参数 */
            extraData?: any;
        }
        /** 集成任务服务代理 */
        class IntegrationJobServiceProxy extends ibas.ServiceProxy<IIntegrationJobServiceContract> {
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace bo {
        /** 集成-动作 */
        interface IAction {
            /** 标识 */
            id: string;
            /** 包组 */
            group: string;
            /** 名称 */
            name: string;
            /** 路径 */
            path: string;
            /** 说明 */
            remark: string;
            /** 激活的 */
            activated: boolean;
            /** 配置 */
            configs: ibas.IList<IActionConfig>;
        }
        /** 集成-动作 */
        interface IActionConfig {
            /** 键 */
            key: string;
            /** 值 */
            value: any;
            /** 说明 */
            remark: string;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace bo {
        /** 集成任务 */
        interface IIntegrationJob extends ibas.IBOSimple {
            /** 名称 */
            name: string;
            /** 是否激活 */
            activated: ibas.emYesNo;
            /** 频率（秒） */
            frequency: number;
            /** 关联的业务对象 */
            boCode: string;
            /** 关联的应用 */
            applicationId: string;
            /** 备注 */
            remarks: string;
            /** 对象编号 */
            objectKey: number;
            /** 对象类型 */
            objectCode: string;
            /** 实例号 */
            logInst: number;
            /** 服务系列 */
            series: number;
            /** 数据源 */
            dataSource: string;
            /** 创建日期 */
            createDate: Date;
            /** 创建时间 */
            createTime: number;
            /** 更新日期 */
            updateDate: Date;
            /** 更新时间 */
            updateTime: number;
            /** 创建用户 */
            createUserSign: number;
            /** 更新用户 */
            updateUserSign: number;
            /** 创建动作标识 */
            createActionId: string;
            /** 更新动作标识 */
            updateActionId: string;
            /** 数据所有者 */
            dataOwner: number;
            /** 团队成员 */
            teamMembers: string;
            /** 数据所属组织 */
            organization: string;
            /** 集成任务-动作集合 */
            integrationJobActions: IIntegrationJobActions;
        }
        /** 集成任务-动作 集合 */
        interface IIntegrationJobActions extends ibas.IBusinessObjects<IIntegrationJobAction> {
            /** 创建并添加子项 */
            create(): IIntegrationJobAction;
        }
        /** 集成任务-动作 */
        interface IIntegrationJobAction extends ibas.IBOSimpleLine {
            /** 对象编号 */
            objectKey: number;
            /** 对象行号 */
            lineId: number;
            /** 对象类型 */
            objectCode: string;
            /** 实例号 */
            logInst: number;
            /** 数据源 */
            dataSource: string;
            /** 创建日期 */
            createDate: Date;
            /** 创建时间 */
            createTime: number;
            /** 更新日期 */
            updateDate: Date;
            /** 更新时间 */
            updateTime: number;
            /** 创建用户 */
            createUserSign: number;
            /** 更新用户 */
            updateUserSign: number;
            /** 创建动作标识 */
            createActionId: string;
            /** 更新动作标识 */
            updateActionId: string;
            /** 与上一个动作的关系 */
            relationship: emActionRelationship;
            /** 任务项标识 */
            actionId: string;
            /** 任务项名称 */
            actionName: string;
            /** 任务项说明 */
            actionRemark: string;
            /** 集成任务-动作-配置集合 */
            integrationJobActionCfgs: IIntegrationJobActionCfgs;
        }
        /** 集成任务-动作-配置 集合 */
        interface IIntegrationJobActionCfgs extends ibas.IBusinessObjects<IIntegrationJobActionCfg> {
            /** 创建并添加子项 */
            create(): IIntegrationJobActionCfg;
        }
        /** 集成任务-动作-配置 */
        interface IIntegrationJobActionCfg extends ibas.IBOSimpleLine {
            /** 对象编号 */
            objectKey: number;
            /** 对象行号 */
            lineId: number;
            /** 对象类型 */
            objectCode: string;
            /** 实例号 */
            logInst: number;
            /** 数据源 */
            dataSource: string;
            /** 创建日期 */
            createDate: Date;
            /** 创建时间 */
            createTime: number;
            /** 更新日期 */
            updateDate: Date;
            /** 更新时间 */
            updateTime: number;
            /** 创建用户 */
            createUserSign: number;
            /** 更新用户 */
            updateUserSign: number;
            /** 创建动作标识 */
            createActionId: string;
            /** 更新动作标识 */
            updateActionId: string;
            /** 动作行号 */
            actionLineId: number;
            /** 配置项健 */
            key: string;
            /** 配置项值 */
            value: string;
            /** 配置项说明 */
            remark: string;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace bo {
        /** 业务仓库 */
        interface IBORepositoryIntegration extends ibas.IBORepositoryApplication {
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
             * 查询 集成任务
             * @param fetcher 查询者
             */
            fetchIntegrationJob(fetcher: ibas.IFetchCaller<bo.IIntegrationJob>): void;
            /**
             * 保存 集成任务
             * @param saver 保存者
             */
            saveIntegrationJob(saver: ibas.ISaveCaller<bo.IIntegrationJob>): void;
            /**
             * 查询 集成动作
             * @param fetcher 查询者
             */
            fetchAction(fetcher: IActionFetcher): void;
            /**
             * 获取动作地址
             */
            toPackageUrl(action: bo.IAction): string;
        }
        /**
         * 集成动作查询者
         */
        interface IActionFetcher extends ibas.IMethodCaller<bo.IAction> {
            /** 查询条件 */
            criteria: ibas.ICriteria | ibas.ICondition[] | bo.IIntegrationJob | bo.IIntegrationJobAction | bo.IIntegrationJobAction[];
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace bo {
        /** 集成动作 */
        class Action implements IAction {
            constructor();
            /** 标识 */
            id: string;
            /** 包组 */
            group: string;
            /** 名称 */
            name: string;
            /** 路径 */
            path: string;
            /** 说明 */
            remark: string;
            /** 激活的 */
            activated: boolean;
            /** 配置 */
            configs: ibas.IList<IActionConfig>;
            /** 完整路径 */
            fullPath(): string;
        }
        /** 集成-动作 */
        class ActionConfig implements IActionConfig {
            /** 键 */
            key: string;
            /** 值 */
            value: any;
            /** 说明 */
            remark: string;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace bo {
        /** 集成任务 */
        class IntegrationJob extends ibas.BOSimple<IntegrationJob> implements IIntegrationJob {
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string;
            /** 构造函数 */
            constructor();
            /** 映射的属性名称-名称 */
            static PROPERTY_NAME_NAME: string;
            /** 获取-名称 */
            /** 设置-名称 */
            name: string;
            /** 映射的属性名称-是否激活 */
            static PROPERTY_ACTIVATED_NAME: string;
            /** 获取-是否激活 */
            /** 设置-是否激活 */
            activated: ibas.emYesNo;
            /** 映射的属性名称-频率（秒） */
            static PROPERTY_FREQUENCY_NAME: string;
            /** 获取-频率（秒） */
            /** 设置-频率（秒） */
            frequency: number;
            /** 映射的属性名称-关联的业务对象 */
            static PROPERTY_BOCODE_NAME: string;
            /** 获取-关联的业务对象 */
            /** 设置-关联的业务对象 */
            boCode: string;
            /** 映射的属性名称-关联的应用 */
            static PROPERTY_APPLICATIONID_NAME: string;
            /** 获取-关联的应用 */
            /** 设置-关联的应用 */
            applicationId: string;
            /** 映射的属性名称-备注 */
            static PROPERTY_REMARKS_NAME: string;
            /** 获取-备注 */
            /** 设置-备注 */
            remarks: string;
            /** 映射的属性名称-对象编号 */
            static PROPERTY_OBJECTKEY_NAME: string;
            /** 获取-对象编号 */
            /** 设置-对象编号 */
            objectKey: number;
            /** 映射的属性名称-对象类型 */
            static PROPERTY_OBJECTCODE_NAME: string;
            /** 获取-对象类型 */
            /** 设置-对象类型 */
            objectCode: string;
            /** 映射的属性名称-实例号 */
            static PROPERTY_LOGINST_NAME: string;
            /** 获取-实例号 */
            /** 设置-实例号 */
            logInst: number;
            /** 映射的属性名称-服务系列 */
            static PROPERTY_SERIES_NAME: string;
            /** 获取-服务系列 */
            /** 设置-服务系列 */
            series: number;
            /** 映射的属性名称-数据源 */
            static PROPERTY_DATASOURCE_NAME: string;
            /** 获取-数据源 */
            /** 设置-数据源 */
            dataSource: string;
            /** 映射的属性名称-创建日期 */
            static PROPERTY_CREATEDATE_NAME: string;
            /** 获取-创建日期 */
            /** 设置-创建日期 */
            createDate: Date;
            /** 映射的属性名称-创建时间 */
            static PROPERTY_CREATETIME_NAME: string;
            /** 获取-创建时间 */
            /** 设置-创建时间 */
            createTime: number;
            /** 映射的属性名称-更新日期 */
            static PROPERTY_UPDATEDATE_NAME: string;
            /** 获取-更新日期 */
            /** 设置-更新日期 */
            updateDate: Date;
            /** 映射的属性名称-更新时间 */
            static PROPERTY_UPDATETIME_NAME: string;
            /** 获取-更新时间 */
            /** 设置-更新时间 */
            updateTime: number;
            /** 映射的属性名称-创建用户 */
            static PROPERTY_CREATEUSERSIGN_NAME: string;
            /** 获取-创建用户 */
            /** 设置-创建用户 */
            createUserSign: number;
            /** 映射的属性名称-更新用户 */
            static PROPERTY_UPDATEUSERSIGN_NAME: string;
            /** 获取-更新用户 */
            /** 设置-更新用户 */
            updateUserSign: number;
            /** 映射的属性名称-创建动作标识 */
            static PROPERTY_CREATEACTIONID_NAME: string;
            /** 获取-创建动作标识 */
            /** 设置-创建动作标识 */
            createActionId: string;
            /** 映射的属性名称-更新动作标识 */
            static PROPERTY_UPDATEACTIONID_NAME: string;
            /** 获取-更新动作标识 */
            /** 设置-更新动作标识 */
            updateActionId: string;
            /** 映射的属性名称-数据所有者 */
            static PROPERTY_DATAOWNER_NAME: string;
            /** 获取-数据所有者 */
            /** 设置-数据所有者 */
            dataOwner: number;
            /** 映射的属性名称-团队成员 */
            static PROPERTY_TEAMMEMBERS_NAME: string;
            /** 获取-团队成员 */
            /** 设置-团队成员 */
            teamMembers: string;
            /** 映射的属性名称-数据所属组织 */
            static PROPERTY_ORGANIZATION_NAME: string;
            /** 获取-数据所属组织 */
            /** 设置-数据所属组织 */
            organization: string;
            /** 映射的属性名称-集成任务-动作集合 */
            static PROPERTY_INTEGRATIONJOBACTIONS_NAME: string;
            /** 获取-集成任务-动作集合 */
            /** 设置-集成任务-动作集合 */
            integrationJobActions: IntegrationJobActions;
            /** 初始化数据 */
            protected init(): void;
        }
        /** 集成任务-动作 集合 */
        class IntegrationJobActions extends ibas.BusinessObjects<IntegrationJobAction, IntegrationJob> implements IIntegrationJobActions {
            /** 创建并添加子项 */
            create(): IntegrationJobAction;
        }
        /** 集成任务-动作 */
        class IntegrationJobAction extends ibas.BOSimpleLine<IntegrationJobAction> implements IIntegrationJobAction {
            /** 构造函数 */
            constructor();
            /** 映射的属性名称-对象编号 */
            static PROPERTY_OBJECTKEY_NAME: string;
            /** 获取-对象编号 */
            /** 设置-对象编号 */
            objectKey: number;
            /** 映射的属性名称-对象行号 */
            static PROPERTY_LINEID_NAME: string;
            /** 获取-对象行号 */
            /** 设置-对象行号 */
            lineId: number;
            /** 映射的属性名称-对象类型 */
            static PROPERTY_OBJECTCODE_NAME: string;
            /** 获取-对象类型 */
            /** 设置-对象类型 */
            objectCode: string;
            /** 映射的属性名称-实例号 */
            static PROPERTY_LOGINST_NAME: string;
            /** 获取-实例号 */
            /** 设置-实例号 */
            logInst: number;
            /** 映射的属性名称-数据源 */
            static PROPERTY_DATASOURCE_NAME: string;
            /** 获取-数据源 */
            /** 设置-数据源 */
            dataSource: string;
            /** 映射的属性名称-创建日期 */
            static PROPERTY_CREATEDATE_NAME: string;
            /** 获取-创建日期 */
            /** 设置-创建日期 */
            createDate: Date;
            /** 映射的属性名称-创建时间 */
            static PROPERTY_CREATETIME_NAME: string;
            /** 获取-创建时间 */
            /** 设置-创建时间 */
            createTime: number;
            /** 映射的属性名称-更新日期 */
            static PROPERTY_UPDATEDATE_NAME: string;
            /** 获取-更新日期 */
            /** 设置-更新日期 */
            updateDate: Date;
            /** 映射的属性名称-更新时间 */
            static PROPERTY_UPDATETIME_NAME: string;
            /** 获取-更新时间 */
            /** 设置-更新时间 */
            updateTime: number;
            /** 映射的属性名称-创建用户 */
            static PROPERTY_CREATEUSERSIGN_NAME: string;
            /** 获取-创建用户 */
            /** 设置-创建用户 */
            createUserSign: number;
            /** 映射的属性名称-更新用户 */
            static PROPERTY_UPDATEUSERSIGN_NAME: string;
            /** 获取-更新用户 */
            /** 设置-更新用户 */
            updateUserSign: number;
            /** 映射的属性名称-创建动作标识 */
            static PROPERTY_CREATEACTIONID_NAME: string;
            /** 获取-创建动作标识 */
            /** 设置-创建动作标识 */
            createActionId: string;
            /** 映射的属性名称-更新动作标识 */
            static PROPERTY_UPDATEACTIONID_NAME: string;
            /** 获取-更新动作标识 */
            /** 设置-更新动作标识 */
            updateActionId: string;
            /** 映射的属性名称-与上一个动作的关系 */
            static PROPERTY_RELATIONSHIP_NAME: string;
            /** 获取-与上一个动作的关系 */
            /** 设置-与上一个动作的关系 */
            relationship: emActionRelationship;
            /** 映射的属性名称-任务项标识 */
            static PROPERTY_ACTIONID_NAME: string;
            /** 获取-任务项标识 */
            /** 设置-任务项标识 */
            actionId: string;
            /** 映射的属性名称-任务项名称 */
            static PROPERTY_ACTIONNAME_NAME: string;
            /** 获取-任务项名称 */
            /** 设置-任务项名称 */
            actionName: string;
            /** 映射的属性名称-任务项说明 */
            static PROPERTY_ACTIONREMARK_NAME: string;
            /** 获取-任务项说明 */
            /** 设置-任务项说明 */
            actionRemark: string;
            /** 映射的属性名称-集成任务-动作-配置集合 */
            static PROPERTY_INTEGRATIONJOBACTIONCFGS_NAME: string;
            /** 获取-集成任务-动作-配置集合 */
            /** 设置-集成任务-动作-配置集合 */
            integrationJobActionCfgs: IntegrationJobActionCfgs;
            /** 初始化数据 */
            protected init(): void;
        }
        /** 集成任务-动作-配置 集合 */
        class IntegrationJobActionCfgs extends ibas.BusinessObjects<IntegrationJobActionCfg, IntegrationJobAction> implements IIntegrationJobActionCfgs {
            /** 创建并添加子项 */
            create(): IntegrationJobActionCfg;
        }
        /** 集成任务-动作-配置 */
        class IntegrationJobActionCfg extends ibas.BOSimpleLine<IntegrationJobActionCfg> implements IIntegrationJobActionCfg {
            /** 构造函数 */
            constructor();
            /** 映射的属性名称-对象编号 */
            static PROPERTY_OBJECTKEY_NAME: string;
            /** 获取-对象编号 */
            /** 设置-对象编号 */
            objectKey: number;
            /** 映射的属性名称-对象行号 */
            static PROPERTY_LINEID_NAME: string;
            /** 获取-对象行号 */
            /** 设置-对象行号 */
            lineId: number;
            /** 映射的属性名称-对象类型 */
            static PROPERTY_OBJECTCODE_NAME: string;
            /** 获取-对象类型 */
            /** 设置-对象类型 */
            objectCode: string;
            /** 映射的属性名称-实例号 */
            static PROPERTY_LOGINST_NAME: string;
            /** 获取-实例号 */
            /** 设置-实例号 */
            logInst: number;
            /** 映射的属性名称-数据源 */
            static PROPERTY_DATASOURCE_NAME: string;
            /** 获取-数据源 */
            /** 设置-数据源 */
            dataSource: string;
            /** 映射的属性名称-创建日期 */
            static PROPERTY_CREATEDATE_NAME: string;
            /** 获取-创建日期 */
            /** 设置-创建日期 */
            createDate: Date;
            /** 映射的属性名称-创建时间 */
            static PROPERTY_CREATETIME_NAME: string;
            /** 获取-创建时间 */
            /** 设置-创建时间 */
            createTime: number;
            /** 映射的属性名称-更新日期 */
            static PROPERTY_UPDATEDATE_NAME: string;
            /** 获取-更新日期 */
            /** 设置-更新日期 */
            updateDate: Date;
            /** 映射的属性名称-更新时间 */
            static PROPERTY_UPDATETIME_NAME: string;
            /** 获取-更新时间 */
            /** 设置-更新时间 */
            updateTime: number;
            /** 映射的属性名称-创建用户 */
            static PROPERTY_CREATEUSERSIGN_NAME: string;
            /** 获取-创建用户 */
            /** 设置-创建用户 */
            createUserSign: number;
            /** 映射的属性名称-更新用户 */
            static PROPERTY_UPDATEUSERSIGN_NAME: string;
            /** 获取-更新用户 */
            /** 设置-更新用户 */
            updateUserSign: number;
            /** 映射的属性名称-创建动作标识 */
            static PROPERTY_CREATEACTIONID_NAME: string;
            /** 获取-创建动作标识 */
            /** 设置-创建动作标识 */
            createActionId: string;
            /** 映射的属性名称-更新动作标识 */
            static PROPERTY_UPDATEACTIONID_NAME: string;
            /** 获取-更新动作标识 */
            /** 设置-更新动作标识 */
            updateActionId: string;
            /** 映射的属性名称-动作行号 */
            static PROPERTY_ACTIONLINEID_NAME: string;
            /** 获取-动作行号 */
            /** 设置-动作行号 */
            actionLineId: number;
            /** 映射的属性名称-配置项健 */
            static PROPERTY_KEY_NAME: string;
            /** 获取-配置项健 */
            /** 设置-配置项健 */
            key: string;
            /** 映射的属性名称-配置项值 */
            static PROPERTY_VALUE_NAME: string;
            /** 获取-配置项值 */
            /** 设置-配置项值 */
            value: string;
            /** 映射的属性名称-配置项说明 */
            static PROPERTY_REMARK_NAME: string;
            /** 获取-配置项说明 */
            /** 设置-配置项说明 */
            remark: string;
            /** 初始化数据 */
            protected init(): void;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace bo {
        /** 数据转换者 */
        class DataConverter extends ibas.DataConverter4j {
            parsing(data: any, sign: string): any;
            /** 创建业务对象转换者 */
            protected createConverter(): ibas.BOConverter;
            /** 转换数据 */
            static toMessageType(level: ibas.emMessageLevel): ibas.emMessageType;
        }
        /** 模块业务对象工厂 */
        const boFactory: ibas.BOFactory;
        /** 动作类加载器 */
        interface IActionClassLoader {
            /** 动作信息 */
            action: bo.Action;
            /** 错误 */
            onError: (error: Error) => void;
            /** 成功 */
            onCompleted: (clazz: any) => void;
        }
        /** 动作类加载器 */
        interface IActionClassCreater extends IActionClassLoader {
            /** 成功 */
            onCompleted: (action: ibas.Action) => void;
        }
        /** 动作工厂 */
        class ActionFactory {
            /** 获取动作的类 */
            classOf(caller: IActionClassLoader): void;
            create(caller: IActionClassCreater): void;
        }
        /** 模块业务对象工厂 */
        const actionFactory: ActionFactory;
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace bo {
        /** 业务对象仓库 */
        class BORepositoryIntegration extends ibas.BORepositoryApplication implements IBORepositoryIntegration {
            /** 创建此模块的后端与前端数据的转换者 */
            protected createConverter(): ibas.IDataConverter;
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
             * 查询 集成任务
             * @param fetcher 查询者
             */
            fetchIntegrationJob(fetcher: ibas.IFetchCaller<bo.IntegrationJob>): void;
            /**
             * 保存 集成任务
             * @param saver 保存者
             */
            saveIntegrationJob(saver: ibas.ISaveCaller<bo.IntegrationJob>): void;
            /**
             * 查询 集成动作
             * @param fetcher 查询者
             */
            fetchAction(fetcher: IActionFetcher): void;
            /**
             * 删除 集成动作
             * @param fetcher 查询者
             */
            deleteActionPackage(deleter: IPackageDeleter): void;
            /**
             * 上传程序包
             * @param caller 调用者
             */
            uploadActionPackage(caller: ibas.IUploadFileCaller<bo.Action>): void;
            /**
             * 获取动作地址
             */
            toUrl(action: bo.Action): string;
            /**
             * 获取动作地址
             */
            toPackageUrl(action: bo.Action): string;
            /**
             * 下载代码文件
             * @param caller 调用者
             */
            downloadCode(caller: ICodeDownloader<Blob>): void;
        }
        /** 代码下载者 */
        interface ICodeDownloader<T> extends ibas.IMethodCaller<T> {
            /** 标识 */
            action: bo.Action;
        }
        /** 包删除者 */
        interface IPackageDeleter extends ibas.IMethodCaller<any> {
            /** 被删除 */
            beDeleted: string;
        }
        /** 代码下载仓库 */
        class CodeRepositoryDownloadAjax extends ibas.RemoteRepositoryXhr {
            constructor();
            /**
             * 下载文件
             * @param method 方法地址
             * @param caller 调用者
             */
            download<T>(method: string, caller: ibas.IMethodCaller<any>): void;
            protected createHttpRequest(method: string, data: any): XMLHttpRequest;
        }
        /** 业务对象仓库-集成开发 */
        class BORepositoryIntegrationDevelopment extends ibas.BORepositoryApplication {
            constructor();
            /** 创建此模块的后端与前端数据的转换者 */
            protected createConverter(): ibas.IDataConverter;
            /**
             * 读取 集成动作
             * @param fetcher 读取者
             */
            loadActions(loader: IActionsLoader): void;
        }
        /** 动作读取者 */
        interface IActionsLoader extends ibas.IMethodCaller<bo.Action> {
            /** 地址 */
            url: string;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace bo {
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace app {
        class DevelopmentTerminalFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID: string;
            /** 功能名称 */
            static FUNCTION_NAME: string;
            /** 构造函数 */
            constructor();
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView>;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace app {
        /** 开发终端 */
        class DevelopmentTerminalApp extends ibas.Application<IDevelopmentTerminalView> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            /** 构造函数 */
            constructor();
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            protected loadActions(url: string): void;
            private usingAction;
            protected useAction(data: bo.Action): void;
            protected runAction(autoRun: boolean): void;
        }
        /** 视图-开发终端 */
        interface IDevelopmentTerminalView extends ibas.IView {
            /** 加载动作，参数1：地址 */
            loadActionsEvent: Function;
            /** 显示动作 */
            showActions(datas: bo.Action[]): void;
            /** 使用动作 */
            useActionEvent: Function;
            /** 显示动作 */
            showAction(data: bo.Action): void;
            /** 显示动作配置 */
            showActionConfigs(datas: bo.ActionConfig[]): void;
            /** 运行动作 */
            runActionEvent: Function;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace app {
        /** 选择应用-集成任务 */
        class IntegrationActionChooseApp extends ibas.BOChooseService<IIntegrationActionChooseView, bo.Action> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string;
            /** 构造函数 */
            constructor();
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            /** 查询数据 */
            protected fetchData(criteria: ibas.ICriteria): void;
            /** 新建数据 */
            protected newData(): void;
        }
        /** 视图-集成任务 */
        interface IIntegrationActionChooseView extends ibas.IBOChooseView {
            /** 显示数据 */
            showData(datas: bo.Action[]): void;
        }
        /** 集成任务选择服务映射 */
        class IntegrationActionChooseServiceMapping extends ibas.BOChooseServiceMapping {
            /** 构造函数 */
            constructor();
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOChooseServiceCaller<bo.Action>>;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace app {
        /** 列表应用-集成任务 */
        class IntegrationActionListApp extends ibas.Application<IIntegrationActionListView> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            /** 构造函数 */
            constructor();
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            /** 查询数据 */
            protected fetchData(criteria: ibas.ICriteria): void;
            /** 上传程序包 */
            protected uploadActionPackage(formData: FormData): void;
            protected viewCode(data: bo.Action | bo.Action[]): void;
            /** 删除数据，参数：目标数据集合 */
            protected deleteData(data: bo.Action | bo.Action[]): void;
        }
        /** 视图-集成任务 */
        interface IIntegrationActionListView extends ibas.IBOQueryView {
            /** 上传包 */
            uploadActionPackageEvent: Function;
            /** 删除数据事件，参数：删除对象集合 */
            deleteDataEvent: Function;
            /** 查看代码 */
            viewCodeEvent: Function;
            /** 显示数据 */
            showData(datas: bo.Action[]): void;
            /** 显示代码 */
            showCode(code: Blob): void;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace app {
        /** 动作运行 */
        class IntegrationActionRunnerApp extends ibas.Application<IIntegrationActionRunnerView> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            /** 构造函数 */
            constructor();
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            /** 额外的运行数据 */
            extraData: any;
            /** 自动运行 */
            autoRun: boolean;
            run(): void;
            run(action: bo.Action | bo.Action[]): void;
            private actions;
            private groupAction;
            private runActions;
            private stopActions;
        }
        /** 视图-动作运行 */
        interface IIntegrationActionRunnerView extends ibas.IView {
            /** 运行 */
            runActionsEvent: Function;
            /** 停止 */
            stopActionsEvent: Function;
            /** 显示动作 */
            showActions(datas: bo.Action[]): void;
            /** 显示消息 */
            showMessages(type: ibas.emMessageType, message: string): void;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace app {
        class IntegrationActionFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID: string;
            /** 功能名称 */
            static FUNCTION_NAME: string;
            /** 构造函数 */
            constructor();
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView>;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace app {
        /** 集成任务运行 */
        class IntegrationJobRunnerApp extends IntegrationActionRunnerApp {
            /** 构造函数 */
            constructor();
            run(): void;
            run(job: bo.IntegrationJob): void;
            run(action: bo.Action | bo.Action[]): void;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace app {
        /** 集成任务运行 */
        class IntegrationJobApp extends IntegrationJobRunnerApp {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            constructor();
            run(): void;
            run(job: bo.IntegrationJob): void;
            run(action: bo.Action | bo.Action[]): void;
            run(proxy: IntegrationJobServiceProxy): void;
            /** 运行服务 */
            runService(contract: IIntegrationJobServiceContract): void;
        }
        /** 集成任务服务映射 */
        class IntegrationJobAppMapping extends ibas.ServiceMapping {
            constructor();
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract>;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace app {
        /** 集成任务调度者 */
        class IntegrationJobSchedulerApp extends ibas.ResidentApplication<IIntegrationJobSchedulerView> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            /** 构造函数 */
            constructor();
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            /** 工具条显示后 */
            protected barShowed(): void;
            private activated;
            private jobs;
            private schedule;
            private reset;
            private suspend;
        }
        /** 视图-集成任务调度者 */
        interface IIntegrationJobSchedulerView extends ibas.IResidentView {
            /** 显示任务 */
            showJobs(datas: TaskAction[]): void;
            /** 暂停运行事件 */
            suspendEvent: Function;
            /** 重置事件 */
            resetEvent: Function;
        }
        /** 任务动作 */
        class TaskAction extends ibas.Action {
            /** 工作 */
            job: bo.IntegrationJob;
            /** 上次运行时间 */
            lastRunTime: number;
            /** 激活的 */
            activated: boolean;
            /** 日志者 */
            logger: ibas.ILogger;
            /** 设置日志记录者 */
            setLogger(logger: ibas.ILogger): void;
            /** 进行 */
            do(): void;
            protected done(): void;
            /** 运行 */
            protected run(): boolean;
            /** 运行子任务 */
            private runActions;
            /** 子任务 */
            private actions;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace app {
        /** 选择应用-集成任务 */
        class IntegrationJobChooseApp extends ibas.BOChooseService<IIntegrationJobChooseView, bo.IntegrationJob> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string;
            /** 构造函数 */
            constructor();
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            /** 查询数据 */
            protected fetchData(criteria: ibas.ICriteria): void;
            /** 新建数据 */
            protected newData(): void;
        }
        /** 视图-集成任务 */
        interface IIntegrationJobChooseView extends ibas.IBOChooseView {
            /** 显示数据 */
            showData(datas: bo.IntegrationJob[]): void;
        }
        /** 集成任务选择服务映射 */
        class IntegrationJobChooseServiceMapping extends ibas.BOChooseServiceMapping {
            /** 构造函数 */
            constructor();
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOChooseServiceCaller<bo.IntegrationJob>>;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace app {
        /** 编辑应用-集成任务 */
        class IntegrationJobEditApp extends ibas.BOEditApplication<IIntegrationJobEditView, bo.IntegrationJob> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string;
            /** 构造函数 */
            constructor();
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            /** 运行,覆盖原方法 */
            run(): void;
            run(data: bo.IntegrationJob): void;
            /** 待编辑的数据 */
            protected editData: bo.IntegrationJob;
            /** 待编辑的数据 */
            protected editIntegrationJobAction: bo.IntegrationJobAction;
            /** 保存数据 */
            protected saveData(): void;
            /** 删除数据 */
            protected deleteData(): void;
            /** 新建数据，参数1：是否克隆 */
            protected createData(clone: boolean): void;
            /** 添加集成任务-动作事件 */
            private addIntegrationJobAction;
            /** 删除集成任务-动作事件 */
            private removeIntegrationJobAction;
            /** 编辑审集成任务-动作事件 */
            private editJobActionEvent;
            /** 添加集成任务-动作事件 */
            private addIntegrationJobActionCfg;
            /** 删除集成任务-动作事件 */
            private removeIntegrationJobActionCfg;
            /** 选择业务对象 */
            private chooseBusinessObject;
            /** 选择应用 */
            private chooseApplication;
            /** 选择任务动作 */
            private chooseJobAction;
            /** 选择任务动作配置-配置项目 */
            private chooseJobActionCfgConfigItem;
        }
        /** 视图-集成任务 */
        interface IIntegrationJobEditView extends ibas.IBOEditView {
            /** 显示数据 */
            showIntegrationJob(data: bo.IntegrationJob): void;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 新建数据事件，参数1：是否克隆 */
            createDataEvent: Function;
            /** 选择业务对象 */
            chooseBusinessObjectEvent: Function;
            /** 选择应用 */
            chooseApplicationEvent: Function;
            /** 添加集成任务-动作事件 */
            addIntegrationJobActionEvent: Function;
            /** 删除集成任务-动作事件 */
            removeIntegrationJobActionEvent: Function;
            /** 编辑任务动作 */
            editJobActionEvent: Function;
            /** 显示数据 */
            showIntegrationJobActions(datas: bo.IntegrationJobAction[]): void;
            /** 选择任务动作 */
            chooseJobActionEvent: Function;
            /** 添加集成任务-动作事件 */
            addIntegrationJobActionCfgEvent: Function;
            /** 删除集成任务-动作事件 */
            removeIntegrationJobActionCfgEvent: Function;
            /** 显示数据 */
            showIntegrationJobActionCfgs(datas: bo.IntegrationJobActionCfg[]): void;
            /** 选择任务动作配置-配置项目 */
            chooseJobActionCfgConfigItemEvent: Function;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace app {
        class IntegrationJobFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID: string;
            /** 功能名称 */
            static FUNCTION_NAME: string;
            /** 构造函数 */
            constructor();
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView>;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace app {
        /** 列表应用-集成任务 */
        class IntegrationJobListApp extends ibas.BOListApplication<IIntegrationJobListView, bo.IntegrationJob> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string;
            /** 构造函数 */
            constructor();
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            /** 查询数据 */
            protected fetchData(criteria: ibas.ICriteria): void;
            /** 新建数据 */
            protected newData(): void;
            /** 查看数据，参数：目标数据 */
            protected viewData(data: bo.IntegrationJob): void;
            /** 编辑数据，参数：目标数据 */
            protected editData(data: bo.IntegrationJob): void;
            /** 删除数据，参数：目标数据集合 */
            protected deleteData(data: bo.IntegrationJob | bo.IntegrationJob[]): void;
        }
        /** 视图-集成任务 */
        interface IIntegrationJobListView extends ibas.IBOListView {
            /** 编辑数据事件，参数：编辑对象 */
            editDataEvent: Function;
            /** 删除数据事件，参数：删除对象集合 */
            deleteDataEvent: Function;
            /** 显示数据 */
            showData(datas: bo.IntegrationJob[]): void;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace app {
        /** 集成任务服务 */
        class IntegrationJobService extends ibas.ServiceApplication<IIntegrationJobServiceView, ibas.IBOServiceContract> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            constructor();
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            /** 额外的运行数据 */
            extraData: any;
            /** 运行服务 */
            runService(contract: ibas.IBOServiceContract): void;
            /** 查询数据 */
            protected fetchData(criteria: ibas.ICriteria): void;
            protected runJob(job: bo.IntegrationJob, autoRun: boolean): void;
        }
        /** 集成任务服务-视图 */
        interface IIntegrationJobServiceView extends ibas.IView {
            /** 显示任务 */
            showJobs(datas: bo.IntegrationJob[]): void;
            /** 运行任务 */
            runJobEvent: Function;
        }
        /** 集成任务服务映射 */
        class IntegrationJobServiceMapping extends ibas.ServiceMapping {
            constructor();
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract>;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace integration {
    namespace app {
        /** 模块控制台 */
        class Console extends ibas.ModuleConsole {
            /** 构造函数 */
            constructor();
            private _navigation;
            /** 创建视图导航 */
            navigation(): ibas.IViewNavigation;
            /** 初始化 */
            protected registers(): void;
            /** 运行 */
            run(): void;
        }
        /** 模块控制台 */
        class ConsolePhone extends Console {
            /** 初始化 */
            protected registers(): void;
        }
        /** 模块控制台 */
        class ConsoleDev extends ibas.ModuleConsole {
            /** 构造函数 */
            constructor();
            private _navigation;
            /** 创建视图导航 */
            navigation(): ibas.IViewNavigation;
            /** 初始化 */
            protected registers(): void;
            /** 运行 */
            run(): void;
        }
    }
}
