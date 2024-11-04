import SuperfundMap from './superfund';

document.addEventListener('DOMContentLoaded', () => {
  const superfundMap = new SuperfundMap('viz');
  superfundMap.loadData().catch(console.error);

  // Add event listeners to checkboxes
  document.querySelectorAll('input[type="checkbox"][data-filter]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      filterPoints(checkbox.dataset.filter, checkbox.checked);
    });
  });
});

function filterPoints(selector, show) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.style.display = show ? 'block' : 'none';
  });
}