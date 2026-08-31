import { ConfirmModal } from '../../common/ConfirmModal';

export function DeleteConfirmationModals({
  deletingContent,
  onCloseDeleteContent,
  onConfirmDeleteContent,
  deletingBatch,
  onCloseDeleteBatch,
  onConfirmDeleteBatch,
  isDeletingBatch,
  deleteBatchError
}) {
  return (
    <>
      <ConfirmModal
        isOpen={Boolean(deletingContent)}
        onClose={onCloseDeleteContent}
        onConfirm={onConfirmDeleteContent}
        title="Konfirmasi Hapus Materi"
        message={`Apakah Anda yakin ingin menghapus materi "${deletingContent?.title}"?\n\nMateri yang telah dihapus tidak dapat dipulihkan kembali.`}
        confirmText="Ya, Hapus Materi"
        cancelText="Batal"
        type="danger"
      />

      <ConfirmModal
        isOpen={Boolean(deletingBatch)}
        onClose={onCloseDeleteBatch}
        onConfirm={onConfirmDeleteBatch}
        loading={isDeletingBatch}
        title="Konfirmasi Hapus Batch Kurikulum"
        message={`Apakah Anda yakin ingin menghapus batch "${deletingBatch?.batchName}" beserta seluruh modul dan materi di dalamnya?\n\nTindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus Seluruh Batch"
        cancelText="Batal"
        type="danger"
      />
    </>
  );
}
