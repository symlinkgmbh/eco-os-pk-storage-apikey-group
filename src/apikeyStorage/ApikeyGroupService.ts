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




import { STORAGE_TYPES, storageContainer, AbstractBindings } from "@symlinkde/eco-os-pk-storage";
import { bootstrapperContainer } from "@symlinkde/eco-os-pk-core";
import { MsUser, PkStorageApikeyGroup, PkStorage } from "@symlinkde/eco-os-pk-models";
import { injectable } from "inversify";
import { ApikeyGroup } from "./ApikeyGroup";

@injectable()
export class ApikeyGroupService extends AbstractBindings implements PkStorageApikeyGroup.IApikeyGroupService {
  private apikeyGroupRepro: PkStorage.IMongoRepository<ApikeyGroup>;

  public constructor() {
    super(storageContainer);

    this.initDynamicBinding(
      [STORAGE_TYPES.Database, STORAGE_TYPES.Collection, STORAGE_TYPES.StorageTarget],
      ["secondlock", "apikey_groups", "SECONDLOCK_MONGO_APIKEY_GROUPS"],
    );

    this.initStaticBinding(
      [STORAGE_TYPES.SECONDLOCK_REGISTRY_URI],
      [bootstrapperContainer.get("SECONDLOCK_REGISTRY_URI")],
    );

    this.apikeyGroupRepro = this.getContainer().getTagged<PkStorage.IMongoRepository<ApikeyGroup>>(
      STORAGE_TYPES.IMongoRepository,
      STORAGE_TYPES.STATE_LESS,
      false,
    );
  }

  public async addKey(key: MsUser.IApikeyGroup): Promise<MsUser.IApikeyGroup | null> {
    const result = await this.apikeyGroupRepro.create(new ApikeyGroup(key));
    if (!result) {
      return null;
    }

    return result;
  }

  public async addMembers(id: string, members: Array<string>): Promise<MsUser.IApikeyGroup | null> {
    const result = await this.apikeyGroupRepro.findOne(id);
    if (!result) {
      return null;
    }

    const currentMembers = [...result.members];
    members.map((member: string) => {
      if (currentMembers.indexOf(member) === -1) {
        currentMembers.push(member);
      }
    });

    result.members = currentMembers;
    if (!(await this.apikeyGroupRepro.update(id, result))) {
      return null;
    }

    return result;
  }

  public async getAllGroups(): Promise<Array<MsUser.IApikeyGroup> | null> {
    const result = await this.apikeyGroupRepro.find({});
    if (!result || result.length === 0) {
      return null;
    }

    return result;
  }

  public async getGroupById(id: string): Promise<MsUser.IApikeyGroup | null> {
    const result = await this.apikeyGroupRepro.findOne(id);
    if (!result) {
      return null;
    }

    return result;
  }

  public async loadGroupByApikey(key: string): Promise<MsUser.IApikeyGroup | null> {
    const result = await this.apikeyGroupRepro.find({ key });
    if (!result || result.length < 1) {
      return null;
    }

    return result[0];
  }

  public async addDomains(id: string, domains: Array<string>): Promise<MsUser.IApikeyGroup | null> {
    const result = await this.apikeyGroupRepro.findOne(id);
    if (!result) {
      return null;
    }

    const currentDomains = [...result.domains];
    domains.map((domain: string) => {
      if (currentDomains.indexOf(domain) === -1) {
        currentDomains.push(domain);
      }
    });

    result.domains = currentDomains;
    if (!(await this.apikeyGroupRepro.update(id, result))) {
      return null;
    }

    return result;
  }

  public async deleteMember(id: string, member: string): Promise<MsUser.IApikeyGroup | null> {
    const result = await this.apikeyGroupRepro.findOne(id);
    if (!result) {
      return null;
    }

    const currentMembers = [...result.members];
    currentMembers.map((cmember: string) => {
      if (cmember === member) {
        currentMembers.splice(currentMembers.indexOf(cmember), 1);
      }
    });

    result.members = currentMembers;
    if (!(await this.apikeyGroupRepro.update(id, result))) {
      return null;
    }

    return result;
  }

  public async deleteDomain(id: string, domain: string): Promise<MsUser.IApikeyGroup | null> {
    const result = await this.apikeyGroupRepro.findOne(id);
    if (!result) {
      return null;
    }

    const currentDomains = [...result.domains];
    currentDomains.map((cdomain: string) => {
      if (cdomain === domain) {
        currentDomains.splice(currentDomains.indexOf(cdomain), 1);
      }
    });

    result.domains = currentDomains;
    if (!(await this.apikeyGroupRepro.update(id, result))) {
      return null;
    }

    return result;
  }

  public async deleteKey(id: string): Promise<boolean> {
    return await this.apikeyGroupRepro.delete(id);
  }
}
