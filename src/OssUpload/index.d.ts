import * as React from "react";
import { UploadProps } from "antd/lib/upload";

interface DataProps {
  businessId?: number;
  businessType?: string;
  companyId: number;
  digestMethod?: 1 | 2;
  ext?: string;
  moduleCode: string;
  productLineId: number;
}

interface UploadFile {
  uid: string;
  size: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  percent?: number;
  thumbUrl?: string;
  originFileObj?: File;
  response?: any;
  error?: any;
  linkProps?: any;
  type: string;
}

export function convertToBase64(str: string): string;

export function toMD5(file: UploadFile): PromiseLike<any>;
export interface OssUploadProps extends UploadProps {
  contentType?: string;
  contentDisposition?: string;
  data: DataProps;
}

export default class OssUpload extends React.Component<OssUploadProps, any> {}
