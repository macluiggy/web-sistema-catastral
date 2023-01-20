//import { getEnabledCategories } from "trace_events";

type canton = 'daule' | 'yaguachi' | 'playas' | 'yaguachi_conciliacion' | 'pangua';

export class GlobalConstants {

  public static APP: canton = 'daule';
  public static BD: string = `/${GlobalConstants.APP}`;

}
