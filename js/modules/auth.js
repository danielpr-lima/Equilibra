import { toast } from './utils.js';

// === FUNÇÃO DE REGISTRO ===
export function initRegistroForm() {
    const form = document.getElementById('formRegistro');
    if (!form) return; 

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('regNome').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const senha = document.getElementById('regSenha').value;
        const confirmaSenha = document.getElementById('regConfirmaSenha').value;

        // Validação simples
        if (senha !== confirmaSenha) {
            toast('⚠️ As senhas não coincidem!');
            return;
        }

        // Cria o objeto do usuário
        const novoUsuario = {
            nome: nome,
            email: email,
            senha: senha 
        };

        // Salva no LocalStorage
        localStorage.setItem('equilibra_usuario', JSON.stringify(novoUsuario));

        toast('✅ Conta criada com sucesso! Redirecionando...');

        // Aguarda 1.5 segundos para a pessoa ler a mensagem verde e manda pro Login
        setTimeout(() => {
            window.location.href = 'Login.html';
        }, 1500);
    });
}

// === FUNÇÃO DE LOGIN ===
export function initLoginForm() {
    const form = document.getElementById('formLogin');
    if (!form) return; // Só corre se estivermos na página de login

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailDigitado = document.getElementById('loginEmail').value.trim();
        const senhaDigitada = document.getElementById('loginSenha').value;

        // 1. Vai buscar os dados da conta que acabámos de criar no LocalStorage
        const dadosConta = localStorage.getItem('equilibra_usuario');
        
        // 2. Se não existir conta
        if (!dadosConta) {
            toast('⚠️ Nenhuma conta encontrada. Crie uma conta primeiro!');
            return;
        }

        const usuarioSalvo = JSON.parse(dadosConta);

        // 3. Verifica se o email e a senha coincidem
        if (emailDigitado === usuarioSalvo.email && senhaDigitada === usuarioSalvo.senha) {
            toast('✅ Bem-vindo(a) de volta!');
            
            // Redireciona para a Home após 1 segundo
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            // Se falhar a senha ou email
            toast('❌ E-mail ou senha incorretos.');
        }
    });
}