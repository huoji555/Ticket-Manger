package com.account.daoImpl;

import javax.annotation.Resource;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.account.dao.IStudentDao;
import com.account.entity.student;

@Repository(value = "IStudentDao")
public class StudentDaoImpl extends BaseDaoImpl<student> implements IStudentDao{
	
	@Resource
	private SessionFactory sessionFactory;
	
	@Override
	public Session getCurrentSession() {
		Session session = null;
		try {
			session = this.sessionFactory.getCurrentSession();

		} catch (Exception e) {
			System.out.println(e);
		}
		System.out.println(session);
		return session;
	}

	
}
