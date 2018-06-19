/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace barcode {
    export namespace app {
        /** 条码生成-参数 */
        export class BarCodeCreatorParam extends ibas.BusinessObjectBase<BarCodeCreatorParam>  {
            /** 构造函数 */
            constructor() {
                super();
                let that: this = this;
                this.registerListener({
                    propertyChanged(name: string): void {
                        that.onPropertyChanged(name);
                    }
                });
            }
            //#region 属性定义
            /** 映射的属性名称-条码类型 */
            static PROPERTY_CODETYPE_NAME: string = "CodeType";
            /** 获取-条码类型 */
            get codeType(): emBarCodeType {
                return this.getProperty<emBarCodeType>(BarCodeCreatorParam.PROPERTY_CODETYPE_NAME);
            }
            /** 设置-条码类型 */
            set codeType(value: emBarCodeType) {
                this.setProperty(BarCodeCreatorParam.PROPERTY_CODETYPE_NAME, value);
            }
            /** 映射的属性名称-内容 */
            static PROPERTY_CONTENT_NAME: string = "Content";
            /** 获取-内容 */
            get content(): string {
                return this.getProperty<string>(BarCodeCreatorParam.PROPERTY_CONTENT_NAME);
            }
            /** 设置-内容 */
            set content(value: string) {
                this.setProperty(BarCodeCreatorParam.PROPERTY_CONTENT_NAME, value);
            }
            /** 映射的属性名称-纠错级别 */
            static PROPERTY_LEVEL_NAME: string = "Level";
            /** 获取-纠错级别 */
            get level(): string {
                return this.getProperty<string>(BarCodeCreatorParam.PROPERTY_LEVEL_NAME);
            }
            /** 设置-纠错级别 */
            set level(value: string) {
                this.setProperty(BarCodeCreatorParam.PROPERTY_LEVEL_NAME, value);
            }
            /** 映射的属性名称-压缩格式 */
            static PROPERTY_SUFFIX_NAME: string = "Suffix";
            /** 获取-压缩格式 */
            get suffix(): string {
                return this.getProperty<string>(BarCodeCreatorParam.PROPERTY_SUFFIX_NAME);
            }
            /** 设置-压缩格式 */
            set suffix(value: string) {
                this.setProperty(BarCodeCreatorParam.PROPERTY_SUFFIX_NAME, value);
            }
            /** 映射的属性名称-宽度 */
            static PROPERTY_WIDTH_NAME: string = "Width";
            /** 获取-宽度 */
            get width(): number {
                return this.getProperty<number>(BarCodeCreatorParam.PROPERTY_WIDTH_NAME);
            }
            /** 设置-宽度 */
            set width(value: number) {
                this.setProperty(BarCodeCreatorParam.PROPERTY_WIDTH_NAME, value);
            }
            /** 映射的属性名称-高度 */
            static PROPERTY_HEIGHT_NAME: string = "Height";
            /** 获取-高度 */
            get height(): number {
                return this.getProperty<number>(BarCodeCreatorParam.PROPERTY_HEIGHT_NAME);
            }
            /** 设置-高度 */
            set height(value: number) {
                this.setProperty(BarCodeCreatorParam.PROPERTY_HEIGHT_NAME, value);
            }
            /** 映射的属性名称-边框 */
            static PROPERTY_MARGIN_NAME: string = "Margin";
            /** 获取-边框 */
            get margin(): number {
                return this.getProperty<number>(BarCodeCreatorParam.PROPERTY_MARGIN_NAME);
            }
            /** 设置-边框 */
            set margin(value: number) {
                this.setProperty(BarCodeCreatorParam.PROPERTY_MARGIN_NAME, value);
            }
            /** 映射的属性名称-文字描述 */
            static PROPERTY_TITLE_NAME: string = "Title";
            /** 获取-文字描述 */
            get title(): string {
                return this.getProperty<string>(BarCodeCreatorParam.PROPERTY_TITLE_NAME);
            }
            /** 设置-文字描述 */
            set title(value: string) {
                this.setProperty(BarCodeCreatorParam.PROPERTY_TITLE_NAME, value);
            }
            /** 映射的属性名称-字号大小 */
            static PROPERTY_FONTSIZE_NAME: string = "FontSize";
            /** 获取-字号大小 */
            get fontSize(): number {
                return this.getProperty<number>(BarCodeCreatorParam.PROPERTY_FONTSIZE_NAME);
            }
            /** 设置-字号大小 */
            set fontSize(value: number) {
                this.setProperty(BarCodeCreatorParam.PROPERTY_FONTSIZE_NAME, value);
            }
            /** 映射的属性名称-图片logo */
            static PROPERTY_LOGO_NAME: string = "Logo";
            /** 获取-图片logo */
            get logo(): string {
                return this.getProperty<string>(BarCodeCreatorParam.PROPERTY_LOGO_NAME);
            }
            /** 设置-图片logo */
            set logo(value: string) {
                this.setProperty(BarCodeCreatorParam.PROPERTY_LOGO_NAME, value);
            }
            /** 映射的属性名称-服务地址 */
            static PROPERTY_ADDRESS_NAME: string = "Address";
            /** 获取-服务地址 */
            get address(): string {
                return this.getProperty<string>(BarCodeCreatorParam.PROPERTY_ADDRESS_NAME);
            }
            /** 设置-服务地址 */
            set address(value: string) {
                this.setProperty(BarCodeCreatorParam.PROPERTY_ADDRESS_NAME, value);
            }
            //#endregion
            protected init(): void {
                this.codeType = emBarCodeType.QR_CODE;
                this.suffix = "png";
                this.content = "hello world!";
                this.title = "hello world!";
                this.initQRCode();
                let fileAddress: string = ibas.config.get(
                    ibas.strings.format(ibas.CONFIG_ITEM_TEMPLATE_REMOTE_REPOSITORY_ADDRESS,
                        BO_REPOSITORY_BARCODE));
                if (!ibas.objects.isNull(fileAddress)) {
                    fileAddress = ibas.urls.normalize(fileAddress);
                    if (!fileAddress.endsWith("/")) { fileAddress += "/"; }
                    fileAddress = fileAddress.replace("/services/rest/data/", "/services/rest/file/");
                }
                this.address = fileAddress;
            }
            initBarCode(): void {
                this.width = 300;
                this.height = 50;
                this.fontSize = 15;
            }
            initQRCode(): void {
                this.level = "H";
                this.margin = 1;
                this.width = 300;
                this.height = 300;
                this.fontSize = 20;
                this.logo = "";
            }
            /**
             * 通知属性改变
             * @param property 属性
             */
            protected firePropertyChanged(property: string): void {
                super.firePropertyChanged(property);
            }
            /** 属性改变时 */
            protected onPropertyChanged(name: string): void {
                if (name.toLowerCase() === BarCodeCreatorParam.PROPERTY_CODETYPE_NAME.toLowerCase()) {
                    if (this.codeType === emBarCodeType.BAR_CODE) {
                        this.initBarCode();
                    } else {
                        this.initQRCode();
                    }
                }
            }
            delete(): void {
                this.markDeleted(true);
            }
            toString(): string {
                if (ibas.objects.isNull(this.address)) {
                    return "";
                }
                let result: string = "";
                if (this.codeType === emBarCodeType.BAR_CODE) {
                    result = ibas.strings.format("barcode?content={0}&width={1}&height={2}&title={3}&fontsize={4}&suffix={5}",
                        encodeURIComponent(this.content), this.width, this.height,
                        encodeURIComponent(this.title), this.fontSize, this.suffix);
                } else if (this.codeType === emBarCodeType.QR_CODE) {
                    result = ibas.strings.format("qrcode?content={0}&width={1}&height={2}&title={3}&fontsize={4}&suffix={5}&logo={6}&margin={7}&level={8}",
                        encodeURIComponent(this.content), this.width, this.height,
                        encodeURIComponent(this.title), this.fontSize, this.suffix,
                        encodeURIComponent(this.logo), this.margin, this.level);
                }
                // 加#号是为了把后面的字符串都作为hash处理,避免作为参数传入,引发错误
                // sap.m.Image 会在src后面追加@1.5等字符串
                return ibas.strings.format("{0}{1}#", this.address, result);
            }
        }
    }
}