import axios from "axios";
import { inject, injectable } from "inversify";
import { OverallTraceabilityProfile } from "../../core/model";
import { Entity, Photo, Value } from "../../core/model/datatypes";
import { Logger } from "../../util/Logger";

@injectable()
export class EcommerceBuilder {
  constructor(
    @inject("Logger") private logger: Logger,
  ) { }

  public generateJSON(tenantID: string, otps: OverallTraceabilityProfile[]) {
    // console.log(otps);
    return this.getEcommerceGenerator(tenantID).then((ecomGen) => {
      const ecomJSON = {
        components: {
          dimensions: this.generateDimensions(otps, ecomGen),
          map: this.generateMap(otps, ecomGen),
          pointOfSale: this.generatePOS(otps, ecomGen),
        },
        ecomQueryStage: ecomGen.ecomQueryStage,
        name: ecomGen.name,
        revision: ecomGen.revision,
        tenantId: ecomGen.tenantId,
        version: ecomGen.version,
        workflowRevision: ecomGen.workflowRevision,
      };
      return ecomJSON;
    }).catch((err) => {
      this.logger.error(err);
      return err;
    });
  }

  public getEcommerceGenerator(tenantId: string) {
    return axios.get("http://www.mocky.io/v2/5a9536ce3500000f009b1156").then((res) => {
      return res.data;
    }).catch((err) => {
      this.logger.error(err);
      return err;
    });
  }

  private generatePOS(otps: OverallTraceabilityProfile[], ecomGen: any) {
    const items: any = [];
    ecomGen.components.pointOfSale.items.forEach((item: any) => {
      const stage = item.data.stage;
      const key = item.data.key;
      let val: any;
      const td: any = this.createTDList(otps, stage, key);
      switch (item.function.name) {
        case "countAllUnique":
          val = this.countAllUnique(td.data);
          break;
        case "countDesiredValue":
          val = this.countDesiredValue(td.data, item.function.desiredValue, td.type);
          break;
        case "mode":
          val = this.mode(td.data, td.type);
          break;
        default:
          this.logger.info("switch default");
      }
      const itemObj: any = {
        displayInfo: item.displayInfo,
        title: this.titleFunction(item.title, td.data, td.type),
      };
      if (!val) {
        delete itemObj.data;
      }
      if (val || val === 0) {
        itemObj.data = val;
      }
      items.push(itemObj);
    });
    return items;
  }

  private generateMap(otps: OverallTraceabilityProfile[], ecomGen: any) {
    const items: any = [];
    ecomGen.components.map.tabs.forEach((tab: any) => {
      const td: any = [];
      otps.forEach((otp) => {
        tab.coordinates.forEach((coordin: any) => {
          const stage = coordin.stage;
          const key = coordin.key;
          if (this.isTDExists(otp, stage)) {
            const v = this.getTDByKey(otp.getClientProfile().get(stage).
              traceabilityDataPackets[0].traceabilityData,
              key);
            if (v) {
              if (Array.isArray(v.getValue())) {
                v.getValue().forEach((element: any) => {
                  if (Array.isArray(element)) {
                    element.forEach((elem: any) => {
                      if (elem.geoCode) {
                        td.push(elem.geoCode);
                      }
                    });
                  } else {
                    if (element.geoCode) {
                      td.push(element.geoCode);
                    }
                  }
                });
              } else {
                const e = v;
                if (v.getValue().geoCode) {
                  td.push(v.getValue().geoCode);
                }
              }
            }
          }
        });

      });
      const itemObj = {
        tabName: tab.title,
        values: td,
      };
      items.push(itemObj);
    });
    return items;
  }

  private generateDimensions(otps: OverallTraceabilityProfile[], ecomGen: any) {
    const items: any = [];
    ecomGen.components.dimensions.items.forEach((item: any) => {
      const result: any = [];
      item.data.forEach((element: any) => {
        const stage = element.stage;
        const key = element.key;
        const td: any = this.createTDList(otps, stage, key);
        let val: any;
        switch (element.function) {
          case "range":
            val = this.range(td.data, td.type);
            break;
          case "mode":
            val = this.mode(td.data, td.type);
            break;
          case "allTrue":
            val = this.allTrue(td.data, td.type);
            break;
          case "array":
            val = td.data;
            break;
        }
        const res = {
          key: element.key,
          label: element.label,
          value: val,
        };
        result.push(res);
      });
      const itemObj = {
        data: result,
        displayInfo: item.displayInfo,
      };
      items.push(itemObj);

    });
    return items;
  }

  /**
   * @description loop Entity[] and check if key exists
   * @returns TD if found if not returns undefined
   */
  private getTDByKey(traceabilityData: Entity[], key: string): Value<any> {
    for (const td of traceabilityData) {
      const item = td as Value<any>;
      if (item.getKey() === key) {
        return item;
      }
    }
    return null;

  }

  private isTDExists(otp: OverallTraceabilityProfile, stage: string): boolean {
    if (otp.getClientProfile().get(stage) &&
      otp.getClientProfile().get(stage).traceabilityDataPackets[0] &&
      otp.getClientProfile().get(stage).traceabilityDataPackets[0].traceabilityData) {
      return true;
    } else {
      return false;
    }
  }

  private createTDList(otps: OverallTraceabilityProfile[], stage: string, tdKey: string) {
    const td: any = [];
    let dataType: number;
    otps.forEach((otp) => {
      if (this.isTDExists(otp, stage)) {
        const v = this.getTDByKey(otp.getClientProfile().get(stage).
          traceabilityDataPackets[0].traceabilityData,
          tdKey) as Value<any>;
        if (v) {
          if (Array.isArray(v.getValue())) {
            v.getValue().forEach((element: any) => {
              td.push(element);
              dataType = v.type;
            });
          } else {
            td.push(v.getValue());
            dataType = v.type;
          }
        }
      }
    });
    return {
      data: td,
      type: dataType,
    };
  }

  private countAllUnique(td: any) {
    const hmap = new Map<any, number>();
    td.forEach((element: any) => {
      if (hmap.has(element)) {
        hmap.set(element, hmap.get( element) + 1);
      } else {
        hmap.set(element, 1);
      }
    });
    const keys: string[] = [...hmap.keys()];
    const res: any = {};
    keys.forEach((element) => {
      res[element] = hmap.get(element);
    });
    return res;
  }

  private countDesiredValue(td: any, desiredValue: any, type: any) {
    let res;
    switch (type) {
      case 0:
        res = this.fractionBoolean(td, desiredValue);
        break;
      case 1:
      case 2:
        res = this.fractionNumber(td, desiredValue);
        break;
      case 5:
      case 7:
        res = this.fractionString(td, desiredValue);
        break;
      case 6:
        res = this.fractionArtifact(td, desiredValue);
        break;
    }
    return res;
  }

  private fractionBoolean(td: any, desiredValue: boolean) {
    let count: number = 0;
    td.forEach((elem: boolean) => {
      if (elem === desiredValue) {
        count++;
      }
    });
    return count;
  }

  // BEWARE THIS MAY NOT WORK
  private fractionNumber(td: any, desiredValue: number) {
    let count: number = 0;
    // tslint:disable-next-line:forin
    for (const elem in td) {
      if (Number(elem) === desiredValue) {
        count++;
      }
    }
    return count;
  }

  // BEWARE THIS MAY NOT WORK
  private fractionString(td: any, desiredValue: string) {
    let count: number = 0;
    td.forEach((elem: string) => {
      if (elem === desiredValue) {
        count++;
      }
      // console.log(desiredValue + elem);
    });
    return count;
  }

  // BEWARE THIS MAY NOT WORK
  private fractionArtifact(td: any, desiredValue: object) {
    let count: number = 0;
    td.forEach((elem: object) => {
      if (Object.is(elem, desiredValue)) {
        count++;
      }
    });
    return count;
  }

  private mode(td: any, dataType: number) {
    const count: any = [];
    let maxElem: any;
    count[maxElem] = 0;
    td.forEach((element: any) => {
      if (count[element]) {
        count[element] += 1;
      } else {
        count[element] = 1;
      }
      if (count[element] > count[maxElem]) {
        maxElem = element;
      }
    });
    return maxElem;
  }

  private range(td: any, dataType: number) {
    let res: any;
    let maxNum: number;
    let minNum: number;
    switch (dataType) {
      case 1:
      case 2:
        maxNum = Number.MIN_SAFE_INTEGER;
        minNum = Number.MAX_SAFE_INTEGER;
        td.forEach((elem: number) => {
          if (elem > maxNum) {
            maxNum = elem;
          }
          if (elem < minNum) {
            minNum = elem;
          }
        });
        res = {
          max: maxNum,
          min: minNum,
        };
        break;
      case 3:
        maxNum = 0;
        minNum = Date.now();
        td.forEach((element: any) => {
          const elem = (new Date(element)).getTime();
          if (elem > maxNum) {
            maxNum = elem;
          }
          if (elem < minNum) {
            minNum = elem;
          }
        });
        res = {
          max: new Date(maxNum),
          min: new Date(minNum),
        };
        break;
    }
    return res;
  }

  private allTrue(td: any, dataType: number) {
    if (dataType === 0) {
      let res: boolean = true;
      td.forEach((element: boolean) => {
        if (!element) {
          res = false;
        }
      });
      return res;
    } else {
      return false;
    }
  }

  private titleFunction(title: any, td: any, dataType: number) {
    let val: string;
    switch (title.function) {
      case "NA":
        val = title.default;
        break;
      case "mode":
        val = this.mode(td, dataType);
        break;
    }
    return val;
  }

}