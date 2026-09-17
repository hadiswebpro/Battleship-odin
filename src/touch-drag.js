/* Touch / pointer dragging for placed ships on phones and tablets. */

const isTouchDevice = window.matchMedia?.("(pointer: coarse)").matches;

if (isTouchDevice) {
  const activeDrags = new WeakSet();

  function setupShipImage(img) {
    if (activeDrags.has(img)) return;
    activeDrags.add(img);

    let dragging = false;
    let dropCell = null;

    img.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse") return;
      event.preventDefault();

      img.setPointerCapture?.(event.pointerId);
      dragging = true;
      dropCell = null;

      img.ondragstart?.({
        dataTransfer: createDataTransfer(),
      });
      img.classList.add("dragging");
    }, { passive: false });

    img.addEventListener("pointermove", (event) => {
      if (!dragging || event.pointerType === "mouse") return;
      event.preventDefault();

      const element = document.elementFromPoint(event.clientX, event.clientY);
      const cell = element?.closest?.(".placement-screen #player-board .cell");
      if (!cell) return;

      dropCell = cell;
      cell.ondragover?.({
        preventDefault() {},
        dataTransfer: createDataTransfer(),
      });
    }, { passive: false });

    const finishDrag = (event) => {
      if (!dragging || event.pointerType === "mouse") return;
      event.preventDefault();

      const element = document.elementFromPoint(event.clientX, event.clientY);
      const cell = element?.closest?.(".placement-screen #player-board .cell") || dropCell;

      if (cell) {
        cell.ondrop?.({
          preventDefault() {},
          dataTransfer: createDataTransfer(),
        });
      }

      img.ondragend?.();
      img.classList.remove("dragging");
      dragging = false;
      dropCell = null;
    };

    img.addEventListener("pointerup", finishDrag, { passive: false });
    img.addEventListener("pointercancel", finishDrag, { passive: false });
  }

  function createDataTransfer() {
    return {
      effectAllowed: "move",
      dropEffect: "move",
      setData() {},
      getData() { return ""; },
    };
  }

  const observer = new MutationObserver(() => {
    document.querySelectorAll("#placement-screen #player-board .ship-image").forEach(setupShipImage);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  document.querySelectorAll("#placement-screen #player-board .ship-image").forEach(setupShipImage);
}
