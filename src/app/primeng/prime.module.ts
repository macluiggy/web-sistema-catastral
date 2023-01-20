import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api'; 
  
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PaginatorModule } from 'primeng/paginator'
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { KeyFilterModule } from 'primeng/keyfilter';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { AccordionModule } from 'primeng/accordion';
import { InplaceModule } from 'primeng/inplace';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { GalleriaModule } from 'primeng/galleria';
import { FileUploadModule } from 'primeng/fileupload';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { FieldsetModule } from 'primeng/fieldset';
import { BlockUIModule } from 'primeng/blockui';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ListboxModule } from 'primeng/listbox';
import { TreeModule } from 'primeng/tree';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { StepsModule } from 'primeng/steps';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';


var components = [  
  CommonModule,
  SharedModule,
  DropdownModule,
  InputMaskModule,
  ButtonModule,
  InputTextModule,
  SlideMenuModule,
  SidebarModule,
  ToolbarModule,
  SplitButtonModule,
  PanelModule,
  CalendarModule,
  InputNumberModule,
  KeyFilterModule,
  RadioButtonModule,
  TableModule,
  DialogModule,
  TooltipModule,
  AccordionModule,
  InplaceModule,
  CheckboxModule,
  InputTextareaModule,
  MultiSelectModule,
  ToastModule,
  ToggleButtonModule,
  TabViewModule,
  GalleriaModule,
  FileUploadModule,
  PanelMenuModule, 
  PaginatorModule,
  ConfirmDialogModule,
  MenuModule,
  TabMenuModule,
  FieldsetModule,
  BlockUIModule,
  CardModule,
  MessagesModule,
  MessageModule,
  ConfirmPopupModule,
  OverlayPanelModule,
  DividerModule,
  ChipModule,
  TagModule,
  SkeletonModule,
  ProgressBarModule,
  SelectButtonModule,
  ListboxModule,
  TreeModule,
  StepsModule,
  TieredMenuModule,
  ScrollPanelModule,
  AvatarModule,
  AvatarGroupModule,
  BadgeModule
]

@NgModule({
  declarations: [],
  imports: components,
  exports: components,
  providers: [
    MessageService,
    ConfirmationService,
  ],
})
export class PrimengModule { }
