

const Modal = ({ title, content, close, callbackFn }) => {
    const handleCloseModal = (e) => {
        // 모달 내부 요소를 클릭한 경우 무시
        if (e.target.closest('.modal-box')) {
            return;
        }
        // 모달 닫기 콜백 함수 호출
        if (callbackFn) {
            callbackFn();
        }
    };
    return (
        <dialog className="modal modal-open" onClick={handleCloseModal}>
            <div className="modal-box pointer-events-auto">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{content}</p>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn" onClick={() => {
                            if(callbackFn) {
                                callbackFn();
                            }
                        }}>{close}</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
  }
  
  export default Modal;
  