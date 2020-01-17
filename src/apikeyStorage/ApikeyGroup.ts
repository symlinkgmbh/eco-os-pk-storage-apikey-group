/**
 * Copyright 2018-2020 Symlink GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */




import { MsUser } from "@symlinkde/eco-os-pk-models";

export class ApikeyGroup implements MsUser.IApikeyGroup {
  public owner: string;
  public domains: Array<string>;
  public key: string;
  public members: Array<string>;
  public expireDate?: Date;
  public accessPerHour?: number;

  constructor(key: MsUser.IApikeyGroup) {
    this.owner = key.owner;
    this.domains = key.domains;
    this.key = key.key;
    this.members = key.members;
    this.expireDate = key.expireDate;
    this.accessPerHour = key.accessPerHour;
  }
}
