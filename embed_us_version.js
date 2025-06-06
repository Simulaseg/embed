// SimulaSeg Embed Script
// Embed script for SimulaSeg insurance simulator
// This script loads the simulator with agent customizations

(function() {
    // Get script element and data attributes
    const scripts = document.getElementsByTagName('script');
    const script = scripts[scripts.length - 1];
    
    // Get agent data from script attributes
    const agentId = script.getAttribute('data-agent-id');
    const whatsapp = script.getAttribute('data-whatsapp');
    const email = script.getAttribute('data-email');
    const secondaryEmail = script.getAttribute('data-secondary-email') || 'segsimula@gmail.com';
    const whatsappMessage = script.getAttribute('data-message') || 'Olá, gostaria de saber mais sobre o seguro de vida.';
    const thankYouUrl = script.getAttribute('data-thank-you-url') || '';
    const primaryColor = script.getAttribute('data-primary-color') || '#0056b3';
    const secondaryColor = script.getAttribute('data-secondary-color') || '#28a745';
    const accentColor = script.getAttribute('data-accent-color') || '#ffc107';
    const formspreeCode = script.getAttribute('data-formspree-code') || '';
    const simulatorTitle = script.getAttribute('data-simulator-title') || 'SIMULE SUA PROTEÇÃO COM BENEFÍCIO EM VIDA';
    
    // Container element
    const container = document.getElementById('simulaseg-embed');
    if (!container) {
        console.error('SimulaSeg: Container element not found. Please add a div with id="simulaseg-embed"');
        return;
    }
    
    // Check if agent is active
    checkAgentStatus(agentId, function(isActive) {
        if (!isActive) {
            container.innerHTML = '<p>Erro: Simulador não disponível. Entre em contato com o suporte.</p>';
            return;
        }
        
        // Load simulator
        loadSimulator();
        
        // Register simulation view
        registerSimulation(agentId);
    });
    
    // Function to check agent status
    function checkAgentStatus(agentId, callback) {
        fetch('https://simulaseg.repl.co/api/check_simulator_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ agent_id: agentId }),
        })
        .then(response => response.json())
        .then(data => {
            callback(data.available === true);
        })
        .catch(error => {
            console.error('SimulaSeg: Error checking agent status:', error);
            callback(false);
        });
    }
    
    // Function to register simulation
    function registerSimulation(agentId) {
        fetch('https://simulaseg.repl.co/api/register_simulation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ agent_id: agentId }),
        })
        .catch(error => {
            console.error('SimulaSeg: Error registering simulation:', error);
        });
    }
    
    // Function to register lead
    function registerLead(agentId, leadData) {
        fetch('https://simulaseg.repl.co/api/register_lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                agent_id: agentId,
                lead_data: leadData
            }),
        })
        .catch(error => {
            console.error('SimulaSeg: Error registering lead:', error);
        });
    }
    
    // Function to load simulator
    function loadSimulator() {
        // Create simulator HTML
        const simulatorHtml = `
        <style>
            #simulaseg-container {
                font-family: 'Arial', sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                box-sizing: border-box;
                color: #333;
            }
            #simulaseg-container * {
                box-sizing: border-box;
            }
            #simulaseg-header {
                background-color: ${primaryColor};
                color: white;
                padding: 15px;
                text-align: center;
                border-radius: 5px 5px 0 0;
                margin-bottom: 0;
            }
            #simulaseg-header h2 {
                margin: 0;
                font-size: 1.5em;
            }
            #simulaseg-form {
                background-color: #f9f9f9;
                padding: 20px;
                border-radius: 0 0 5px 5px;
                border: 1px solid #ddd;
                border-top: none;
            }
            .simulaseg-row {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 15px;
            }
            .simulaseg-col {
                flex: 1;
                padding: 0 10px;
                min-width: 200px;
            }
            .simulaseg-label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            .simulaseg-input, .simulaseg-select {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            .simulaseg-button {
                background-color: ${secondaryColor};
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1em;
                width: 100%;
                margin-top: 10px;
            }
            .simulaseg-button:hover {
                opacity: 0.9;
            }
            #simulaseg-results {
                margin-top: 20px;
                padding: 15px;
                background-color: #f0f0f0;
                border-radius: 5px;
                display: none;
            }
            .simulaseg-result-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
            }
            .simulaseg-result-row:last-child {
                border-bottom: none;
            }
            .simulaseg-result-label {
                font-weight: bold;
            }
            .simulaseg-result-value {
                color: ${primaryColor};
                font-weight: bold;
            }
            #simulaseg-monthly-value {
                font-size: 1.2em;
                color: ${primaryColor};
                text-align: right;
                font-weight: bold;
            }
            #simulaseg-lead-form {
                margin-top: 20px;
                display: none;
            }
            #simulaseg-thank-you {
                display: none;
                text-align: center;
                padding: 20px;
                background-color: #f0f0f0;
                border-radius: 5px;
                margin-top: 20px;
            }
            .simulaseg-note {
                font-size: 0.8em;
                color: #666;
                text-align: center;
                margin-top: 10px;
            }
            .simulaseg-whatsapp-button {
                background-color: #25D366;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1em;
                width: 100%;
                margin-top: 10px;
                text-decoration: none;
                display: inline-block;
                text-align: center;
            }
            .simulaseg-whatsapp-button:hover {
                opacity: 0.9;
            }
            @media (max-width: 600px) {
                .simulaseg-col {
                    flex: 100%;
                    margin-bottom: 10px;
                }
            }
        </style>
        
        <div id="simulaseg-container">
            <div id="simulaseg-header">
                <h2>${simulatorTitle}</h2>
            </div>
            
            <div id="simulaseg-form">
                <div class="simulaseg-row">
                    <div class="simulaseg-col">
                        <label class="simulaseg-label" for="simulaseg-age">Idade</label>
                        <input type="number" id="simulaseg-age" class="simulaseg-input" min="18" max="80" value="35">
                    </div>
                    
                    <div class="simulaseg-col">
                        <label class="simulaseg-label">Gênero</label>
                        <div>
                            <label><input type="radio" name="simulaseg-gender" value="male" checked> Homem</label>
                            <label><input type="radio" name="simulaseg-gender" value="female"> Mulher</label>
                        </div>
                    </div>
                </div>
                
                <div class="simulaseg-row">
                    <div class="simulaseg-col">
                        <label class="simulaseg-label" for="simulaseg-coverage">Cobertura Desejada</label>
                        <input type="text" id="simulaseg-coverage" class="simulaseg-input" value="$200,000">
                    </div>
                    
                    <div class="simulaseg-col">
                        <label class="simulaseg-label" for="simulaseg-state">Estado</label>
                        <select id="simulaseg-state" class="simulaseg-select">
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="FL" selected>Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                            <option value="DC">District of Columbia</option>
                        </select>
                    </div>
                </div>
                
                <button id="simulaseg-calculate" class="simulaseg-button">Calcular</button>
            </div>
            
            <div id="simulaseg-results">
                <h3>Resultado da Simulação</h3>
                
                <div class="simulaseg-result-row">
                    <div class="simulaseg-result-label">Cobertura por Morte:</div>
                    <div class="simulaseg-result-value" id="simulaseg-death-coverage">$200,000.00</div>
                </div>
                
                <div class="simulaseg-result-row">
                    <div class="simulaseg-result-label">Cobertura por Invalidez:</div>
                    <div class="simulaseg-result-value" id="simulaseg-disability-coverage">$200,000.00</div>
                </div>
                
                <div class="simulaseg-result-row">
                    <div class="simulaseg-result-label">Doenças Graves:</div>
                    <div class="simulaseg-result-value" id="simulaseg-critical-illness">$100,000.00</div>
                </div>
                
                <div class="simulaseg-result-row">
                    <div class="simulaseg-result-label">Valor Mensal:</div>
                    <div class="simulaseg-result-value" id="simulaseg-monthly-value">$57.29</div>
                </div>
                
                <div class="simulaseg-note">
                    Simulação de caráter aproximativo. Não constitui proposta formal de seguro.
                </div>
                
                <div id="simulaseg-lead-cta" style="margin-top: 20px; text-align: center;">
                    <p>Quer saber exatamente quanto de benefício em vida você teria?</p>
                    <p>Complete seu e-mail abaixo para receber informações detalhadas.</p>
                    <button id="simulaseg-get-quote" class="simulaseg-button">Receber Cotação Detalhada</button>
                </div>
            </div>
            
            <div id="simulaseg-lead-form">
                <h3>Complete seus dados para receber uma cotação detalhada</h3>
                
                <div class="simulaseg-row">
                    <div class="simulaseg-col">
                        <label class="simulaseg-label" for="simulaseg-name">Nome Completo</label>
                        <input type="text" id="simulaseg-name" class="simulaseg-input" required>
                    </div>
                </div>
                
                <div class="simulaseg-row">
                    <div class="simulaseg-col">
                        <label class="simulaseg-label" for="simulaseg-email">E-mail</label>
                        <input type="email" id="simulaseg-email" class="simulaseg-input" required>
                    </div>
                </div>
                
                <div class="simulaseg-row">
                    <div class="simulaseg-col">
                        <label class="simulaseg-label" for="simulaseg-phone">Telefone</label>
                        <input type="tel" id="simulaseg-phone" class="simulaseg-input" placeholder="+1 (XXX) XXX-XXXX" required>
                    </div>
                </div>
                
                <div class="simulaseg-row">
                    <div class="simulaseg-col">
                        <label class="simulaseg-label">Possui alguma doença grave?</label>
                        <div>
                            <label><input type="radio" name="simulaseg-illness" value="no" checked> Não</label>
                            <label><input type="radio" name="simulaseg-illness" value="yes"> Sim</label>
                        </div>
                    </div>
                </div>
                
                <div class="simulaseg-row">
                    <div class="simulaseg-col">
                        <label class="simulaseg-label">Você já possui seguro de vida?</label>
                        <div>
                            <label><input type="radio" name="simulaseg-has-insurance" value="no" checked> Não, não possuo seguro de vida</label>
                            <label><input type="radio" name="simulaseg-has-insurance" value="yes"> Sim, já possuo seguro de vida</label>
                        </div>
                    </div>
                </div>
                
                <button id="simulaseg-submit" class="simulaseg-button">Enviar</button>
                
                <div class="simulaseg-note" style="margin-top: 15px;">
                    Seus dados estão seguros e não serão compartilhados com terceiros.
                </div>
            </div>
            
            <div id="simulaseg-thank-you">
                <h3>Obrigado!</h3>
                <p>Recebemos suas informações e entraremos em contato em breve com mais detalhes sobre suas opções de seguro de vida.</p>
                
                <a id="simulaseg-whatsapp-link" href="#" class="simulaseg-whatsapp-button" target="_blank">
                    Falar pelo WhatsApp agora
                </a>
            </div>
        </div>
        `;
        
        // Add simulator to container
        container.innerHTML = simulatorHtml;
        
        // Add event listeners
        document.getElementById('simulaseg-calculate').addEventListener('click', calculateSimulation);
        document.getElementById('simulaseg-get-quote').addEventListener('click', showLeadForm);
        document.getElementById('simulaseg-submit').addEventListener('click', submitLead);
        
        // Format coverage input
        const coverageInput = document.getElementById('simulaseg-coverage');
        coverageInput.addEventListener('blur', function() {
            let value = this.value.replace(/[^0-9.]/g, '');
            if (value) {
                value = parseFloat(value).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
                this.value = value;
            }
        });
        
        // Format phone input
        const phoneInput = document.getElementById('simulaseg-phone');
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    this.value = '+1 (' + value;
                } else if (value.length <= 6) {
                    this.value = '+1 (' + value.substring(0, 3) + ') ' + value.substring(3);
                } else {
                    this.value = '+1 (' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
                }
            }
        });
    }
    
    // Function to calculate simulation
    function calculateSimulation() {
        const age = parseInt(document.getElementById('simulaseg-age').value);
        const gender = document.querySelector('input[name="simulaseg-gender"]:checked').value;
        let coverage = document.getElementById('simulaseg-coverage').value;
        coverage = parseFloat(coverage.replace(/[^0-9.]/g, ''));
        const state = document.getElementById('simulaseg-state').value;
        
        // Validate inputs
        if (isNaN(age) || age < 18 || age > 80) {
            alert('Por favor, insira uma idade válida entre 18 e 80 anos.');
            return;
        }
        
        if (isNaN(coverage) || coverage < 50000) {
            alert('Por favor, insira um valor de cobertura válido (mínimo $50,000).');
            return;
        }
        
        // Calculate monthly value based on age, gender, coverage, and state
        let baseRate;
        if (gender === 'male') {
            if (age < 30) baseRate = 0.15;
            else if (age < 40) baseRate = 0.20;
            else if (age < 50) baseRate = 0.30;
            else if (age < 60) baseRate = 0.45;
            else baseRate = 0.65;
        } else {
            if (age < 30) baseRate = 0.12;
            else if (age < 40) baseRate = 0.16;
            else if (age < 50) baseRate = 0.25;
            else if (age < 60) baseRate = 0.38;
            else baseRate = 0.55;
        }
        
        // State factor (simplified)
        const stateFactor = {
            'FL': 1.2, 'NY': 1.3, 'CA': 1.25, 'TX': 1.1, 'IL': 1.05
        }[state] || 1.0;
        
        // Calculate monthly value
        const monthlyValue = (coverage * baseRate * stateFactor) / 1000;
        
        // Update results
        document.getElementById('simulaseg-death-coverage').textContent = formatCurrency(coverage);
        document.getElementById('simulaseg-disability-coverage').textContent = formatCurrency(coverage);
        document.getElementById('simulaseg-critical-illness').textContent = formatCurrency(coverage * 0.5);
        document.getElementById('simulaseg-monthly-value').textContent = formatCurrency(monthlyValue);
        
        // Show results
        document.getElementById('simulaseg-results').style.display = 'block';
    }
    
    // Function to show lead form
    function showLeadForm() {
        document.getElementById('simulaseg-lead-form').style.display = 'block';
        document.getElementById('simulaseg-lead-cta').style.display = 'none';
        
        // Scroll to lead form
        document.getElementById('simulaseg-lead-form').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Function to submit lead
    function submitLead() {
        const name = document.getElementById('simulaseg-name').value;
        const email = document.getElementById('simulaseg-email').value;
        const phone = document.getElementById('simulaseg-phone').value;
        const hasIllness = document.querySelector('input[name="simulaseg-illness"]:checked').value === 'yes';
        const hasInsurance = document.querySelector('input[name="simulaseg-has-insurance"]:checked').value === 'yes';
        const age = document.getElementById('simulaseg-age').value;
        const coverage = document.getElementById('simulaseg-coverage').value;
        const state = document.getElementById('simulaseg-state').value;
        
        // Validate inputs
        if (!name || !email || !phone) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Prepare lead data
        const leadData = {
            name: name,
            email: email,
            phone: phone,
            has_illness: hasIllness,
            has_insurance: hasInsurance,
            age: age,
            coverage: coverage,
            state: state
        };
        
        // Send lead to agent via Formspree
        if (formspreeCode) {
            const formData = new FormData();
            Object.keys(leadData).forEach(key => {
                formData.append(key, leadData[key]);
            });
            
            fetch(`https://formspree.io/f/${formspreeCode}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .catch(error => {
                console.error('SimulaSeg: Error sending lead to Formspree:', error);
            });
        }
        
        // Register lead in SimulaSeg system
        registerLead(agentId, leadData);
        
        // Show thank you message
        document.getElementById('simulaseg-lead-form').style.display = 'none';
        document.getElementById('simulaseg-thank-you').style.display = 'block';
        
        // Set WhatsApp link
        const whatsappLink = document.getElementById('simulaseg-whatsapp-link');
        const whatsappMessage = encodeURIComponent(whatsappMessage);
        whatsappLink.href = `https://wa.me/${whatsapp}?text=${whatsappMessage}`;
        
        // Redirect to thank you page if provided
        if (thankYouUrl) {
            setTimeout(() => {
                window.location.href = thankYouUrl;
            }, 3000);
        }
    }
    
    // Helper function to format currency
    function formatCurrency(value) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
})();
