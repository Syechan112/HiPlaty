import { BatchSelectModal } from './BatchSelectModal';
import { ModuleSelectModal } from './ModuleSelectModal';
import { ContentPickerModal } from './ContentPickerModal';
import { CategorySelectModal } from './CategorySelectModal';
import { ConfirmModal } from '../../common/ConfirmModal';

export function EditorModalsContainer({ editor }) {
  const {
    showBatchModal,
    setShowBatchModal,
    batchSearch,
    setBatchSearch,
    modalFilteredBatches,
    selectedBatchId,
    handleBatchSelect,
    showModuleModal,
    setShowModuleModal,
    moduleSearch,
    setModuleSearch,
    modalFilteredModules,
    selectedModuleId,
    handleModuleSelect,
    handleOpenContentPicker,
    handleSelectModuleForNewContent,
    handleCreateNewModuleFromModal,
    showContentPickerModal,
    setShowContentPickerModal,
    selectedModuleForContentPicker,
    contentPickerSearch,
    setContentPickerSearch,
    modalFilteredContents,
    loadedContentId,
    category,
    handleSelectSpecificContentToEdit,
    showCategoryModal,
    setShowCategoryModal,
    setCategory,
    showConfirmLoadModal,
    setShowConfirmLoadModal,
    pendingLoadContent,
    loadContentIntoEditor,
    showSaveConfirmModal,
    setShowSaveConfirmModal,
    executeSave,
    isSaving,
    isEditMode,
    contentTitle,
    currentModuleDisplay
  } = editor;

  return (
    <>
      <BatchSelectModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        batchSearch={batchSearch}
        setBatchSearch={setBatchSearch}
        modalFilteredBatches={modalFilteredBatches}
        selectedBatchId={selectedBatchId}
        handleBatchSelect={handleBatchSelect}
      />

      <ModuleSelectModal
        isOpen={showModuleModal}
        onClose={() => setShowModuleModal(false)}
        moduleSearch={moduleSearch}
        setModuleSearch={setModuleSearch}
        modalFilteredModules={modalFilteredModules}
        selectedModuleId={selectedModuleId}
        handleModuleSelect={handleModuleSelect}
        handleOpenContentPicker={handleOpenContentPicker}
        handleSelectModuleForNewContent={handleSelectModuleForNewContent}
        handleCreateNewModuleFromModal={handleCreateNewModuleFromModal}
      />

      <ContentPickerModal
        isOpen={showContentPickerModal}
        onClose={() => setShowContentPickerModal(false)}
        onCloseAll={() => {
          setShowContentPickerModal(false);
          setShowModuleModal(false);
        }}
        selectedModule={selectedModuleForContentPicker}
        contentPickerSearch={contentPickerSearch}
        setContentPickerSearch={setContentPickerSearch}
        modalFilteredContents={modalFilteredContents}
        loadedContentId={loadedContentId}
        category={category}
        handleSelectSpecificContentToEdit={handleSelectSpecificContentToEdit}
        handleSelectModuleForNewContent={handleSelectModuleForNewContent}
      />

      <CategorySelectModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        category={category}
        setCategory={setCategory}
      />

      <ConfirmModal
        isOpen={showConfirmLoadModal}
        onClose={() => setShowConfirmLoadModal(false)}
        onConfirm={() => {
          if (pendingLoadContent) {
            loadContentIntoEditor(pendingLoadContent.content, pendingLoadContent.module);
          }
          setShowConfirmLoadModal(false);
        }}
        title="Muat Isi Materi dari Modul?"
        message={`Modul "${pendingLoadContent?.module?.moduleTitle}" sudah memiliki materi tersimpan:\n"${pendingLoadContent?.content?.title || 'Materi'}".\n\nApakah Anda ingin memuat isi materi ini ke editor teks untuk diedit? Teks yang sedang Anda ketik sekarang akan digantikan.`}
        confirmText="Ya, Muat & Edit Materi"
        cancelText="Batal (Tetap Pakai Teks Saya)"
        type="warning"
      />

      <ConfirmModal
        isOpen={showSaveConfirmModal}
        onClose={() => setShowSaveConfirmModal(false)}
        onConfirm={executeSave}
        loading={isSaving}
        title={isEditMode || loadedContentId ? "Konfirmasi Perbarui Materi" : "Konfirmasi Simpan Materi"}
        message={
          isEditMode || loadedContentId 
            ? `Apakah Anda yakin ingin memperbarui materi "${contentTitle}" pada modul "${currentModuleDisplay}"?\n\nPerubahan materi akan langsung tersimpan dan disinkronkan ke seluruh sistem.`
            : `Apakah Anda yakin ingin menerbitkan materi baru "${contentTitle}" ke dalam modul "${currentModuleDisplay}"?`
        }
        confirmText={isEditMode || loadedContentId ? "Ya, Perbarui Materi" : "Ya, Terbitkan Materi"}
        cancelText="Periksa Kembali"
        type="info"
      />
    </>
  );
}
