// @mui
import { daDK } from '@mui/material/locale';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'Dansk',
    value: 'da',
    systemValue: daDK,
    icon: '/assets/icons/flags/ic_flag_da.svg',
    dataGrid: {
      // Root
      noRowsLabel: 'Inten rækker',
      noResultsOverlayLabel: 'Fandt ingen resultater.',
    
      // Density selector toolbar button text
      toolbarDensity: 'Tæthed',
      toolbarDensityLabel: 'Tæthed',
      toolbarDensityCompact: 'Kompalt',
      toolbarDensityStandard: 'Standard',
      toolbarDensityComfortable: 'Behagelig',
    
      // Columns selector toolbar button text
      toolbarColumns: 'Kolonner',
      toolbarColumnsLabel: 'Vælg kolonner',
    
      // Filters toolbar button text
      toolbarFilters: 'Filtre',
      toolbarFiltersLabel: 'Vis filtre',
      toolbarFiltersTooltipHide: 'Skjul filtre',
      toolbarFiltersTooltipShow: 'Vis filtre',
      toolbarFiltersTooltipActive: (count) =>
        count !== 1 ? `${count} aktive filtre` : `${count} aktivt filter`,
    
      // Quick filter toolbar field
      toolbarQuickFilterPlaceholder: 'Søg…',
      toolbarQuickFilterLabel: 'Søg',
      toolbarQuickFilterDeleteIconLabel: 'Ryd',
    
      // Export selector toolbar button text
      toolbarExport: 'Eksporter',
      toolbarExportLabel: 'Eksporter',
      toolbarExportCSV: 'Gem som CSV',
      toolbarExportPrint: 'Udskriv',
      toolbarExportExcel: 'Gem som Excel',
    
      // Columns panel text
      columnsPanelTextFieldLabel: 'Find kolonne',
      columnsPanelTextFieldPlaceholder: 'Kolonnetitel',
      columnsPanelDragIconLabel: 'Arranger kolonne',
      columnsPanelShowAllButton: 'Vis alle',
      columnsPanelHideAllButton: 'Skjul alle',
    
      // Filter panel text
      filterPanelAddFilter: 'Tilføj filter',
      filterPanelDeleteIconLabel: 'Slet',
      filterPanelLogicOperator: 'Logisk operator',
      filterPanelOperator: 'Operator',
      filterPanelOperatorAnd: 'Og',
      filterPanelOperatorOr: 'Eller',
      filterPanelColumns: 'Kolonner',
      filterPanelInputLabel: 'Værdi',
      filterPanelInputPlaceholder: 'Filterværdi',
    
      // Filter operators text
      filterOperatorContains: 'indeholder',
      filterOperatorEquals: 'lig med',
      filterOperatorStartsWith: 'begynder med',
      filterOperatorEndsWith: 'ender på',
      filterOperatorIs: 'er',
      filterOperatorNot: 'er ikke',
      filterOperatorAfter: 'er fra',
      filterOperatorOnOrAfter: 'er fra og med',
      filterOperatorBefore: 'er til',
      filterOperatorOnOrBefore: 'er til og med',
      filterOperatorIsEmpty: 'er tom',
      filterOperatorIsNotEmpty: 'er ikke tom',
      filterOperatorIsAnyOf: 'er en af',
    
      // Filter values text
      filterValueAny: 'alle',
      filterValueTrue: 'sand',
      filterValueFalse: 'falsk',
    
      // Column menu text
      columnMenuLabel: 'Menu',
      columnMenuShowColumns: 'Vis kolonner',
      columnMenuManageColumns: 'Håndter kolonner',
      columnMenuFilter: 'Filtrer',
      columnMenuHideColumn: 'Skjul kolonne',
      columnMenuUnsort: 'Fjern sortering',
      columnMenuSortAsc: 'Sorter stigende',
      columnMenuSortDesc: 'Sorter faldende',
    
      // Column header text
      columnHeaderFiltersTooltipActive: (count) =>
        count !== 1 ? `${count} aktive filtre` : `${count} aktivt filter`,
      columnHeaderFiltersLabel: 'Vis filtre',
      columnHeaderSortIconLabel: 'Sorter',
    
      // Rows selected footer text
      footerRowSelected: (count) =>
        count !== 1
          ? `${count.toLocaleString()} rækker valgt`
          : `${count.toLocaleString()} rækker valgt`,
    
      // Total row amount footer text
      footerTotalRows: 'Totale rækker:',
    
      // Total visible row amount footer text
      footerTotalVisibleRows: (visibleCount, totalCount) =>
        `${visibleCount.toLocaleString()} af ${totalCount.toLocaleString()}`,
    
      // Checkbox selection text
      checkboxSelectionHeaderName: 'Checkbokse',
      checkboxSelectionSelectAllRows: 'Vælg alle rækker',
      checkboxSelectionUnselectAllRows: 'Fravælg alle rækker',
      checkboxSelectionSelectRow: 'Vælg række',
      checkboxSelectionUnselectRow: 'Fravælg række',
    
      // Boolean cell text
      booleanCellTrueLabel: 'ja',
      booleanCellFalseLabel: 'nej',
    
      // Actions cell more text
      actionsCellMore: 'mere',
    
      // Column pinning text
      pinToLeft: 'Fastgør til venstre',
      pinToRight: 'Fastgør til højre',
      unpin: 'Frigør',
    
      // Tree Data
      treeDataGroupingHeaderName: 'Gruppe',
      treeDataExpand: 'vis børn',
      treeDataCollapse: 'skjul børn',
    
      // Grouping columns
      groupingColumnHeaderName: 'Gruppér',
      groupColumn: (name) => `Gruppér efter ${name}`,
      unGroupColumn: (name) => `Stop gruppéring efter ${name}`,
    
      // Master/detail
      detailPanelToggle: 'Detaljer panel til/fra',
      expandDetailPanel: 'Udvid',
      collapseDetailPanel: 'Skjul',
    
      // Used core components translation keys
      MuiTablePagination: {},
    
      // Row reordering text
      rowReorderingHeaderName: 'Rækker arrangering',
    
      // Aggregation
      aggregationMenuItemHeader: 'Sammenlægning',
      aggregationFunctionLabelSum: 'sum',
      aggregationFunctionLabelAvg: 'avg',
      aggregationFunctionLabelMin: 'min',
      aggregationFunctionLabelMax: 'max',
      aggregationFunctionLabelSize: 'size',
    },
  },
];

export const defaultLang = allLangs[0]; // Danish
