package br.com.thesharks.hackathon.initializer;

import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import br.com.thesharks.hackathon.config.JPAConfig;
import br.com.thesharks.hackathon.config.MvcConfig;
import br.com.thesharks.hackathon.config.SecurityConfig;
import br.com.thesharks.hackathon.config.ServiceConfig;

public class MvcWebApplicationInitializer  extends AbstractAnnotationConfigDispatcherServletInitializer {

    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{SecurityConfig.class, ServiceConfig.class, JPAConfig.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[] {MvcConfig.class};
    }

    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }

}
