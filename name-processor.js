/**
 * Processador de Nomes
 * Lida com parsing de nomes e desambiguação de duplicados
 */

class NameProcessor {
    /**
     * Limpa e normaliza um nome
     * @param {string} fullName - Nome completo
     * @returns {string} Nome normalizado
     */
    static cleanName(fullName) {
        if (!fullName) return '';
        
        // Remove espaços duplos e trim
        return fullName.trim().replace(/\s+/g, ' ');
    }

    /**
     * Divide um nome completo em partes
     * @param {string} fullName - Nome completo
     * @returns {Array<string>} Array de partes do nome
     */
    static splitName(fullName) {
        const cleaned = this.cleanName(fullName);
        return cleaned.split(' ').filter(part => part.length > 0);
    }

    /**
     * Extrai primeiro e último nome
     * @param {string} fullName - Nome completo
     * @returns {Object} {firstName, lastName, middleNames}
     */
    static extractNames(fullName) {
        const parts = this.splitName(fullName);
        
        if (parts.length === 0) {
            return { firstName: '', lastName: '', middleNames: [] };
        }
        
        if (parts.length === 1) {
            return { firstName: parts[0], lastName: '', middleNames: [] };
        }
        
        const firstName = parts[0];
        const lastName = parts[parts.length - 1];
        const middleNames = parts.slice(1, -1);
        
        return { firstName, lastName, middleNames };
    }

    /**
     * Gera o nome de exibição com desambiguação se necessário
     * @param {string} fullName - Nome completo
     * @param {number} middleNamesToAdd - Número de nomes intermédios a adicionar
     * @returns {string} Nome formatado para exibição
     */
    static formatDisplayName(fullName, middleNamesToAdd = 0) {
        const { firstName, lastName, middleNames } = this.extractNames(fullName);
        
        if (!lastName) {
            return firstName;
        }
        
        // Adicionar nomes intermédios conforme necessário
        const middlePart = middleNames.slice(0, middleNamesToAdd).join(' ');
        
        if (middlePart && middleNamesToAdd > 0) {
            return `${firstName} ${middlePart} ${lastName}`;
        }
        
        return `${firstName} ${lastName}`;
    }

    /**
     * Processa um array de alunos e desambigua nomes duplicados
     * @param {Array<Object>} students - Array de objetos de alunos {Nome, Turma, Email, Password}
     * @returns {Array<Object>} Array de alunos com displayName adicionado
     */
    static processStudents(students) {
        // Criar mapa de duplicados por turma
        const nameCountMap = new Map();
        
        // Primeira passagem: identificar duplicados
        students.forEach((student, index) => {
            const { firstName, lastName } = this.extractNames(student.Nome);
            const key = `${firstName}_${lastName}_${student.Turma}`;
            
            if (!nameCountMap.has(key)) {
                nameCountMap.set(key, []);
            }
            nameCountMap.get(key).push(index);
        });

        // Segunda passagem: processar nomes com desambiguação
        const processed = students.map((student, index) => {
            const { firstName, lastName, middleNames } = this.extractNames(student.Nome);
            const key = `${firstName}_${lastName}_${student.Turma}`;
            const duplicateIndices = nameCountMap.get(key);
            
            let displayName;
            
            // Se não há duplicados, usar primeiro + último
            if (duplicateIndices.length === 1) {
                displayName = this.formatDisplayName(student.Nome, 0);
            } else {
                // Há duplicados - precisamos desambiguar
                const positionInGroup = duplicateIndices.indexOf(index);
                
                // Adicionar nomes intermédios até conseguir desambiguar
                let middleNamesToAdd = 0;
                let isUnique = false;
                
                while (!isUnique && middleNamesToAdd <= middleNames.length) {
                    const testName = this.formatDisplayName(student.Nome, middleNamesToAdd);
                    
                    // Verificar se este nome é único dentro do grupo de duplicados
                    const sameNameCount = duplicateIndices.filter(dupIndex => {
                        const otherStudent = students[dupIndex];
                        const otherTestName = this.formatDisplayName(otherStudent.Nome, middleNamesToAdd);
                        return testName === otherTestName;
                    }).length;
                    
                    if (sameNameCount === 1) {
                        isUnique = true;
                        displayName = testName;
                    } else {
                        middleNamesToAdd++;
                    }
                }
                
                // Se ainda não é único mesmo com todos os nomes intermédios, usar nome completo
                if (!isUnique) {
                    displayName = this.cleanName(student.Nome);
                }
            }
            
            return {
                ...student,
                displayName: displayName,
                sortLastName: lastName || firstName
            };
        });

        return processed;
    }

    /**
     * Ordena alunos por Turma e depois por último nome
     * @param {Array<Object>} students - Array de alunos processados
     * @returns {Array<Object>} Array ordenado
     */
    static sortStudents(students) {
        return students.sort((a, b) => {
            // Primeiro por turma
            const turmaCompare = a.Turma.localeCompare(b.Turma, 'pt', { sensitivity: 'base' });
            if (turmaCompare !== 0) return turmaCompare;
            
            // Depois por último nome
            return a.sortLastName.localeCompare(b.sortLastName, 'pt', { sensitivity: 'base' });
        });
    }
}

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NameProcessor;
}

