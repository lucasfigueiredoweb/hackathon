package br.com.thesharks.hackathon.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import br.com.thesharks.hackathon.model.Response;

@RestControllerAdvice
public class GlobalHandlerException {

	private static final Logger logger = LoggerFactory.getLogger(GlobalHandlerException.class);

	@ExceptionHandler(Exception.class)
	public void exception(Exception e) {
		logger.debug("Ocorreu um erro inesperado.");
	}
	
	@ExceptionHandler(EntidadeNaoEncontradaException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
	@ResponseBody
	public Response exception(EntidadeNaoEncontradaException e) {
						
		return new Response(HttpStatus.NOT_FOUND.value(), e.getMessage());
	}
	
	

}
