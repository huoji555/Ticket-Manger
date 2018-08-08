package com.account.serviceImpl;

import com.account.dao.IBaseDao;
import com.account.dao.IStudentDao;
import com.account.entity.student;
import com.account.service.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class StudentServiceImpl extends BaseServiceImpl<student> implements IStudentService {
	
	
	@Autowired
	@Qualifier(value="IStudentDao")
	private IStudentDao iStudentDao;

	

	/**
	* 注入DAO
	*/
	@Resource(name = "IStudentDao")
	@Override
	public void setDao(IBaseDao<student> dao) {
	super.setDao(dao);
	}
	//保存信息
		public void saveStudent(student student){
			
				this.iStudentDao.save(student);
			
		}


}
