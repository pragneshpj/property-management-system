describe('Owner', () => {
    beforeEach(() => {
      cy.login('super@gmail.com', 'Super@123');
      cy.url().should('include', '/');
      cy.get('[data-testid="Customer"]').click();
      cy.url().should('include', '/customer');
    });
  
    it('should display the Add Customer button', () => {
      cy.get('[data-testid="add-customer"]').should('exist');
    });
  
    it('should add a new customer with default data', () => {
        cy.get('[data-testid="add-customer"]').click();
        
        cy.get('#first_name').type('John');
        cy.get('#last_name').type('Doe');
        cy.get('#email').type('john.doe@example.com');
        cy.get('#gst_no').type('ABC123');
        cy.get('#phone').type('1234567896');
        cy.get('#alternate_phone').type('7987654321');
        cy.get('#city').type('City');
        cy.get('#state').type('State');
        cy.get('#country').type('Country');
        cy.get('#pincode').type('123456');
        cy.get('#aadhar_card_no').type('656565656565');
        cy.get('#address').type('123 Main St');
        cy.get('#landmark').type('Near Park');
        cy.get('#street').type('Oak Street');
    
        cy.get('form').submit();
    
        cy.wait(2000); 
        cy.get('[data-testid="customer-list"]').should('exist');
        cy.contains('John Doe').should('exist');
      });
  
  });
  