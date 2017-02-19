package br.com.thesharks.hackathon.persist.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "usuario")
public class Usuario extends EntidadeAbstrata implements Serializable {

	private static final long serialVersionUID = 1L;

	@Embedded
	private Endereco endereco;

	@OneToMany(mappedBy = "usuario", targetEntity = Interesse.class)
	private List<Interesse> interesse = new ArrayList<>();

	@Column(name = "nome", nullable = false, length = 100)
	private String nome;

	@Column(name = "cpf", nullable = false, length = 11)
	private String cpf;

	@Column(name = "email", nullable = false, length = 50)
	private String email;

	@Column(name = "telefone", length = 20)
	private String telefone;

	@Column(name = "login", nullable = false, length = 20)
	private String login;

	@Column(name = "senha", nullable = false, length = 20)
	private String senha;

	@Column(name = "ativado")
	private Boolean ativado;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "users_authority", joinColumns = {
			@JoinColumn(name = "id_user", referencedColumnName = "id") }, inverseJoinColumns = {
					@JoinColumn(name = "id_authority", table = "authority", referencedColumnName = "id") })
	private Set<Authority> authorities = new HashSet<Authority>();

	public Usuario() {
		super();
	}

	public Usuario(Endereco endereco, List<Interesse> interesse, String nome, String email, String telefone,
			String login, String senha, Boolean ativado, Set<Authority> authorities) {
		super();
		this.endereco = endereco;
		this.interesse = interesse;
		this.nome = nome;
		this.email = email;
		this.telefone = telefone;
		this.login = login;
		this.senha = senha;
		this.ativado = ativado;
		this.authorities = authorities;
	}

	public Endereco getEndereco() {
		return endereco;
	}

	public void setEndereco(Endereco endereco) {
		this.endereco = endereco;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTelefone() {
		return telefone;
	}

	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public Set<Authority> getAuthorities() {
		return authorities;
	}

	public void setAuthorities(Set<Authority> authorities) {
		this.authorities = authorities;
	}

	public List<Interesse> getInteresse() {
		return interesse;
	}

	public void setInteresse(List<Interesse> interesse) {
		this.interesse = interesse;
	}

	public Boolean getAtivado() {
		return ativado;
	}

	public void setAtivado(Boolean ativado) {
		this.ativado = ativado;
	}

}