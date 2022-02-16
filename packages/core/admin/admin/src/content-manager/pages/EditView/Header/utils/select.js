import { useCMEditViewDataManager } from '@strapi/helper-plugin';

function useSelect() {
  const {
    allLayoutData,
    initialData,
    isCreatingEntry,
    isSingleType,
    status,
    layout,
    hasDraftAndPublish,
    modifiedData,
    onPublish,
    onPut,
    onUnpublish,
  } = useCMEditViewDataManager();

  return {
    componentLayouts: allLayoutData.components,
    initialData,
    isCreatingEntry,
    isSingleType,
    status,
    layout,
    hasDraftAndPublish,
    modifiedData,
    onPut,
    onPublish,
    onUnpublish,
  };
}

export default useSelect;
