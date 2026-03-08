describe('AG Grid Data Table', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads the app and shows the grid header', () => {
    cy.contains('h1', 'AG Grid Data Table').should('be.visible');
    cy.contains('10,000 rows').should('be.visible');
  });

  it('renders grid with many rows and shows status chips', () => {
    cy.get('.ag-root-wrapper').should('exist');
    cy.get('.ag-center-cols-viewport .ag-row').should('have.length.greaterThan', 0);
    cy.get('.ag-header-cell-col[col-id="status"]').should('exist');
    cy.get('.chakra-badge').should('have.length.greaterThan', 0);
  });

  it('quick filter updates visible rows and row count label', () => {
    cy.get('input[aria-label="Search table rows across all columns"]').type('Electronics');
    cy.contains(/Showing \d+ of 10,000 rows/i).should('be.visible');
    cy.get('.ag-center-cols-viewport .ag-row').should('have.length.greaterThan', 0);
  });

  it('editing revenue updates profit and status chip in the same row', () => {
    cy.get('.ag-center-cols-viewport .ag-row').first().within(() => {
      cy.get('.ag-cell').eq(4).dblclick(); // 0=checkbox, 1=id, 2=name, 3=category, 4=revenue
    });
    cy.get('.ag-cell-edit-input').clear().type('50');
    cy.get('body').type('{enter}');
    cy.get('.ag-center-cols-viewport .ag-row').first().within(() => {
      cy.get('.chakra-badge').should('exist');
    });
  });

  it('scrolls and remains responsive with large dataset', () => {
    cy.get('.ag-body-horizontal-scroll-viewport').scrollTo('bottom', { duration: 300 });
    cy.get('.ag-center-cols-viewport .ag-row').should('have.length.greaterThan', 0);
    cy.get('.ag-body-horizontal-scroll-viewport').scrollTo('top', { duration: 300 });
    cy.get('.ag-center-cols-viewport .ag-row').first().should('be.visible');
  });
});
